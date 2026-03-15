type VSCode = {
    postMessage(message: any): void;
    getState<T>(): T;
    setState<T>(state: T): void;
};

declare function acquireVsCodeApi(): VSCode;

export const vscode = acquireVsCodeApi();

interface M<T> {
    id: number;

    /**
     * Context ID
     */
    c?: string;

    /**
     * Actual message (or cancellation)
     */
    m: T | null;
}

class Messenger<
    FrontendMsg,
    BackendMsg,
> {
    private listeners = new Set<(message: BackendMsg) => void>();
    private currentId: number;

    constructor(readonly context?: string) {
        this.currentId = 0;
        window.addEventListener('message', this.handle.bind(this));
    }

    postMessage(message: FrontendMsg): () => void {
        const id = this.currentId++;

        vscode.postMessage({
            id,
            c: this.context,
            m: message,
        } satisfies M<FrontendMsg>);

        return () => {
            vscode.postMessage({
                id,
                c: this.context,
                m: null
            });
        };
    }

    onDidReceiveMessage(listener: (message: BackendMsg) => void): { dispose: () => void } {
        this.listeners.add(listener);
        return {
            dispose: () => {
                this.listeners.delete(listener);
            }
        };
    };

    /**
     * Handle the message if it was a reply to a previous request
     * @param event Window event from VSCode
     * @returns True if message was a reply to a previous message
     */
    private handle(raw: {
        data: {
            c: string;
            m: any;
        }
    }) {
        const data = raw.data;

        if (data.c !== this.context) {
            // The message is not for us
            return;
        }

        for (const listener of this.listeners.values()) {
            try {
                listener(data.m);
            } catch (e) {
                console.error(e);
            }
        }
    }

    dispose() {
        window.removeEventListener('message', this.handle.bind(this));
    }
}

const allMessengers = new Map<
    string | undefined,
    Messenger<any, any>
>();

export type { Messenger };

/**
 * Create or get a previously created messaging interface
 * @param context Context name of the messaging pipeline
 * @returns Previously created messenger or new messenger on context
 */
export function getMessages<
    FrontendMsg,
    BackendMsg
>(context?: string): Messenger<FrontendMsg, BackendMsg> {
    const exists = allMessengers.get(context);
    if (exists) {
        return exists;
    } else {
        const out = new Messenger<FrontendMsg, BackendMsg>(context);
        allMessengers.set(context, out);
        return out;
    }
}
