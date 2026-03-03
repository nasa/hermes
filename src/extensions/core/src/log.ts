import * as vscode from 'vscode';
import Transport from 'winston-transport';
import { MESSAGE } from 'triple-beam';

interface VSCTransportOptions extends Transport.TransportStreamOptions {
    name: string;
    json: boolean;
    window: {
        createOutputChannel(name: string, languageId?: string): vscode.OutputChannel;
    }
}

export class VSCTransport extends Transport implements vscode.Disposable {
    name: string;
    outputChannel: vscode.OutputChannel;

    constructor(options: VSCTransportOptions) {
        super(options);
        this.name = options.name || this.constructor.name;
        this.outputChannel = options.window.createOutputChannel(this.name, 'log');
        this.outputChannel.clear();
    }

    log(info: any, callback?: () => void) {
        setImmediate(() => this.emit('logged', info));
        if (this.format) {
            info = this.format.transform(info);
        }

        this.outputChannel.appendLine(`${info[MESSAGE]}`);
        if (callback) {
            callback();
        }
    }

    dispose() {
        this.outputChannel.dispose();
    }
}
