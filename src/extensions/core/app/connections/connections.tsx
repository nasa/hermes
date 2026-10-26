import React, {
    useCallback,
    useEffect,
    useState,
    useMemo
} from 'react';

import {
    VSCodeButton,
    VSCodeDropdown,
    VSCodeOption
} from '@vscode/webview-ui-toolkit/react';

import {
    ActionButton,
    VStack,
    ActionableItem
} from '@gov.nasa.jpl.hermes/rjsf';

import { Proto } from '@gov.nasa.jpl.hermes/types';
import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { Backend, Frontend } from '../../common/connections';

const messages = getMessages<Frontend, Backend>();

export function Progress(props: { active: boolean }) {
    return (
        <div className={"connection-progress-container" + (props.active ? " active" : "")}>
            <div className="connection-progress"></div>
        </div>
    );
}

export default function ConnectionUi() {
    const [writeDisabled, setWriteDisabled] = useState(false);

    const [dictionaries, setDictionaries] = useState<Record<string, Proto.IDictionaryHead>>({});

    const [dictionaryProviders, setDictionaryProviders] = useState<{ key: string, title: string }[]>([]);

    const [selectedDictionaryProvider, setSelectedDictionaryProvider] = useState<string>();

    const [dictionaryLoading, setDictionaryLoading] = useState<boolean>(false);

    const messageHandler = useCallback((message: Backend) => {
        if (message.dictionaryLoading !== undefined) {
            setDictionaryLoading(message.dictionaryLoading);
        }

        if (message.writeDisabled !== undefined) {
            setWriteDisabled(message.writeDisabled);
        }

        if (message.dictionaryProviders) {
            setDictionaryProviders(message.dictionaryProviders);
        }

        if (message.dictionaries) {
            setDictionaries({ ...message.dictionaries });
        }
    }, [selectedDictionaryProvider]);

    // Hook up the messaging to the message handler
    useEffect(() => {
        messages.onDidReceiveMessage(messageHandler);

        messages.postMessage({ type: 'refresh' });
    }, []);

    useEffect(() => {
        if (selectedDictionaryProvider === undefined && dictionaryProviders.length > 0) {
            setSelectedDictionaryProvider(dictionaryProviders[0].key);
        } else if (dictionaryProviders.length === 0) {
            setSelectedDictionaryProvider(undefined);
        }
    }, [dictionaryProviders]);

    const onOpenDictionary = useCallback(() => {
        messages.postMessage({ type: "dictionaryOpen", provider: selectedDictionaryProvider! });
    }, [selectedDictionaryProvider]);

    const dictionariesElem = useMemo(() => Array.from(Object.entries(dictionaries)).map(([dictId, dict], index) => (
        <section className='connection-profile' key={index}>
            <ActionableItem
                title={dict.name ?? "[unknown]"}
                tag={dict.version ?? undefined}
                actions={[
                    {
                        title: "Delete", icon: "trash", disabled: (
                            dictionaryLoading || writeDisabled
                        ), onClick: () => messages.postMessage({ type: "dictionaryDelete", id: dictId })
                    }
                ].map((v, i) => <ActionButton {...v} key={i} />)}
            />
        </section>
    )), [writeDisabled, dictionaries, dictionaryLoading]);

    return (
        <VStack>
            <Progress active={dictionaryLoading} />
            <VSCodeDropdown
                value={selectedDictionaryProvider}
                disabled={dictionaryLoading}
                onChange={e => setSelectedDictionaryProvider((e.target as any).value)}
                id="provider-dropdown"
            >
                {dictionaryProviders.map((v, i) => <VSCodeOption key={i} value={v.key}>{v.title}</VSCodeOption>)}
            </VSCodeDropdown>
            <VSCodeButton disabled={selectedDictionaryProvider === undefined || dictionaryLoading || writeDisabled} className="full" style={{ maxWidth: "100%" }} appearance="primary" onClick={onOpenDictionary}>
                Open Dictionary
                <span slot="start" className="codicon codicon-plus"></span>
            </VSCodeButton>
            {dictionariesElem}
        </VStack>
    );
}
