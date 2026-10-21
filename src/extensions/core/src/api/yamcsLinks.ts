import * as vscode from 'vscode';

import type * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import type { Settings } from '@gov.nasa.jpl.hermes/vscode';

import prettyBytes from '../components/prettyBytes';

// YAMCS publishes SYSTEM parameters about each link. We use its status, and the bytes per second it
// received and sent, which YAMCS computes over the last two seconds.
export const LINK_PARAMETER = /\/links\/([^/]+)\/(linkStatus|dataInRate|dataOutRate)$/;

// fprime-yamcs re-sends telemetry that arrived on UDP_TM_IN to YAMCS through this link, one channel per packet
const SPLIT_LINK = 'UDP_TM_SPLIT_IN';

// We draw an instance's traffic over the last 15 rates with these characters, from lowest to highest
const HISTORY = 15;
const BLOCKS = '▁▂▃▄▅▆▇█';

// A link that a YAMCS instance receives telemetry on or sends commands through
export interface Link {
    name: string;
    // OK, UNAVAIL, DISABLED or FAILED
    status: string;
    // Bytes per second
    inRate: number;
    outRate: number;
}

// Builds an instance's links from one batch of their parameters. YAMCS publishes the parameters of
// every link together once a second, so each batch holds all of them.
export function buildLinks(values: Rpc.YamcsParameterValue[]): Link[] {
    const links = new Map<string, Link>();
    for (const value of values) {
        const [, name, parameter] = value.id!.name!.match(LINK_PARAMETER)!;
        const link = links.get(name) ?? { name, status: '', inRate: 0, outRate: 0 };
        links.set(name, link);
        if (parameter === 'linkStatus') {
            link.status = value.engValue?.stringValue ?? '';
        } else if (parameter === 'dataInRate') {
            link.inRate = value.engValue?.doubleValue ?? 0;
        } else {
            link.outRate = value.engValue?.doubleValue ?? 0;
        }
    }
    // YAMCS gives a link that carries CCSDS frames a sub-link for each virtual channel in them, named like
    // UDP_TC_OUT.vc1. We leave the sub-links out, since their traffic is already part of their parent link's.
    return [...links.values()].filter((link) => ![...links.keys()].some((parent) => link.name.startsWith(`${parent}.`)));
}

// An instance's newest links, and the bytes per second it received and sent in each of the last 15 s, oldest first
interface InstanceLinks {
    links: Link[];
    received: number[];
    sent: number[];
}

// An instance is healthy when every link is OK and it received data in the last 10 s. YAMCS sends the link
// parameters once a second, so those are the last 10 rates.
export function healthy({ links, received }: InstanceLinks): boolean {
    return links.every((link) => link.status === 'OK') && received.slice(-10).some((rate) => rate > 0);
}

// Status bar items that say how many YAMCS instances are healthy, or name a link that isn't OK, then light up an
// arrow while data comes in and another while data goes out
export class LinkHealth implements vscode.Disposable {
    // VscodeApi's two items have priorities 1000 and 999, so these sit right after the YAMCS address
    private readonly health = vscode.window.createStatusBarItem('hermes.yamcsLinks', vscode.StatusBarAlignment.Left, 998);
    private readonly receiving = vscode.window.createStatusBarItem('hermes.yamcsReceiving', vscode.StatusBarAlignment.Left, 997);
    private readonly sending = vscode.window.createStatusBarItem('hermes.yamcsSending', vscode.StatusBarAlignment.Left, 996);
    private readonly instances = new Map<string, InstanceLinks>();

    constructor(private readonly state: Settings.Yamcs, instances: readonly string[]) {
        // YAMCS sends nothing for an instance without links, so we list every instance from the start. Such an
        // instance then counts as not healthy instead of being left out.
        instances.forEach((instance) => this.instances.set(instance, { links: [], received: [], sent: [] }));
        this.receiving.text = '$(arrow-down)';
        this.sending.text = '$(arrow-up)';
    }

    update(instance: string, links: Link[]): void {
        // We leave the split link out of the traffic, since its telemetry already arrived on UDP_TM_IN. Its status still
        // counts toward health, because without it YAMCS decodes only the first channel in each packet from UDP_TM_IN.
        const traffic = links.filter((link) => link.name !== SPLIT_LINK);
        const { received, sent } = this.instances.get(instance)!;
        this.instances.set(instance, {
            links,
            received: [...received, traffic.reduce((total, link) => total + link.inRate, 0)].slice(-HISTORY),
            sent: [...sent, traffic.reduce((total, link) => total + link.outRate, 0)].slice(-HISTORY),
        });
        this.show();
    }

    private show(): void {
        const instances = [...this.instances.values()];
        const healthyCount = instances.filter(healthy).length;
        const failed = [...this.instances].flatMap(([name, { links }]) =>
            links.filter((link) => link.status !== 'OK').map((link) => `${name}: ${link.name} ${link.status}`));
        this.health.text = this.summary(healthyCount, failed[0]);
        this.health.backgroundColor = failed.length > 0 ? new vscode.ThemeColor('statusBarItem.warningBackground') : undefined;
        // An arrow lights up while some instance's newest rate in its direction is above zero
        const receiving = instances.some(({ received }) => (received.at(-1) ?? 0) > 0);
        const sending = instances.some(({ sent }) => (sent.at(-1) ?? 0) > 0);
        this.receiving.color = new vscode.ThemeColor(receiving ? 'charts.green' : 'disabledForeground');
        this.sending.color = new vscode.ThemeColor(sending ? 'charts.yellow' : 'disabledForeground');
        const tooltip = this.tooltip(healthyCount, failed);
        for (const item of [this.health, this.receiving, this.sending]) {
            item.tooltip = tooltip;
            item.show();
        }
    }

    // How many instances are healthy, or the first link that isn't OK
    private summary(healthyCount: number, failed: string | undefined): string {
        if (failed) {
            return `$(warning) ${failed}`;
        }
        if (healthyCount === this.instances.size) {
            return `$(pass) ${healthyCount} healthy`;
        }
        return `$(info) ${healthyCount} of ${this.instances.size} healthy`;
    }

    // A table with a row for each instance's traffic in and out, then the links that aren't OK, what healthy means
    // and which server we're on
    private tooltip(healthyCount: number, failed: string[]): vscode.MarkdownString {
        const rows = [...this.instances].map(([instance, { received, sent }]) =>
            `| **${instance}** | ${sparkline(received, 'charts-green')} | ${sparkline(sent, 'charts-yellow')} |`);
        // Passing true as the second argument lets $(warning) draw as an icon
        const tooltip = new vscode.MarkdownString([
            `**${healthyCount} of ${this.instances.size} instances healthy**`,
            '',
            '| | In, last 15 s | Out, last 15 s |',
            '|---|---|---|',
            ...rows,
            '',
            ...failed.flatMap((link) => [`$(warning) ${link}`, '']),
            'Healthy: every link is OK and some link received data in the last 10 s.',
            '',
            `YAMCS gRPC at ${this.state.address}, processor ${this.state.processor}`,
        ].join('\n'), true);
        // We color the traffic with a span, which VS Code only renders when the markdown allows HTML
        tooltip.supportHtml = true;
        return tooltip;
    }

    dispose(): void {
        this.health.dispose();
        this.receiving.dispose();
        this.sending.dispose();
    }
}

// A line of an instance's rates in one direction, then its newest rate
function sparkline(rates: number[], color: string): string {
    // We scale the line to its own highest rate, so steady traffic draws a flat line at the top and a second without
    // data drops to the bottom
    const highest = Math.max(...rates);
    const line = rates.map((rate) => BLOCKS[rate > 0 ? Math.ceil((rate / highest) * (BLOCKS.length - 1)) : 0]).join('');
    const newest = rates.at(-1) ?? 0;
    // VS Code drops a span's style from a hover unless it is exactly a color like this one, with no spaces
    return `<span style="color:var(--vscode-${color});">${line}</span> ${newest > 0 ? `${prettyBytes(newest)}/s` : 'idle'}`;
}
