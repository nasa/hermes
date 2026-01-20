import React, {
    useCallback,
    useEffect,
    useState,
    useRef,
    useMemo
} from 'react';

import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeTag,
    VSCodeTextField
} from '@vscode/webview-ui-toolkit/react';
import validator from '@rjsf/validator-ajv8';

import VSCodeForm, {
    type ActionButtonProps,
    ActionButton,
    VStack,
    ActionableItem
} from '@gov.nasa.jpl.hermes/rjsf';

import { Proto } from '@gov.nasa.jpl.hermes/types';
import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser';
import type { Backend, Frontend } from '../../common/connections';

import * as rjsf from "@rjsf/utils";
import { ProfileProvider, profileProviderFromProto, StatefulProfile, statefulProfileFromProto } from './convert';

const messages = getMessages<Frontend, Backend>();

export function Progress(props: { active: boolean }) {
    return (
        <div className={"connection-progress-container" + (props.active ? " active" : "")}>
            <div className="connection-progress"></div>
        </div>
    );
}

function getStateName(state: Proto.ProfileState): string {
    switch (state) {
        case Proto.ProfileState.PROFILE_IDLE:
            return "";
        case Proto.ProfileState.PROFILE_CONNECTING:
            return "Connecting";
        case Proto.ProfileState.PROFILE_ACTIVE:
            return "Active";
        case Proto.ProfileState.PROFILE_DISCONNECT:
            return "Disconnecting";
    }
}

function ActiveConnection(props: { fsw: Proto.IFsw }) {
    return (
        <div className="connection">
            {props.fsw.id}
            <div style={{ flexGrow: 1 }} />
            <VSCodeTag>{props.fsw.type}</VSCodeTag>
        </div>
    );
}

function ActiveConnections(props: { connections: Proto.IFsw[] }) {
    return (
        <div className="active-connections">
            {props.connections.map((c, idx) => <ActiveConnection key={idx} fsw={c} />)}
        </div>
    );
}

function ConnectionProfileHeader(props: {
    name: string,
    disabled: boolean,
    setName?: (newName: string) => void,
    state: Proto.ProfileState,
    actions: ActionButtonProps[]
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const inputRef = useRef<any>(undefined);

    const displayState = useMemo(() => getStateName(props.state), [props.state]);

    const changeValue = useCallback((e: any) => {
        props.setName?.(e.target.value);
        setIsEditing(false);
    }, [isEditing]);

    const onDoubleClick = useCallback(() => {
        if (props.setName) {
            if (props.state === Proto.ProfileState.PROFILE_IDLE && !props.disabled) {
                setIsEditing(true);
            }
        }
    }, [props.state, props.disabled]);

    if (!isEditing) {
        return (
            <ActionableItem
                title={props.name}
                tag={displayState}
                onTitleDoubleClick={onDoubleClick}
                actions={props.actions.map((v, i) => <ActionButton {...v} key={i} />)}
            />
        );
    } else {
        // Work around no autofocus in VSCodeTextField
        // (There is an option but its not hooked up: https://github.com/microsoft/vscode-webview-ui-toolkit/issues/381)
        setTimeout(() => inputRef.current?.focus(), 2);
        return (
            <VSCodeTextField
                ref={inputRef}
                value={props.name}
                onChange={changeValue}
                onBlur={changeValue}
            />
        );
    }
}

interface InvalidProfileProps {
    cfgId: string;
    header: string;
    hint?: string;

    name: string;
    disabled: boolean;

    errors: Error[];
}

function InvalidProfile({
    cfgId,
    header,
    hint,
    name,
    disabled,
    errors,
}: InvalidProfileProps) {
    const actions = [{
        title: "Delete",
        icon: "trash",
        disabled,
        onClick: () => messages.postMessage({ type: "profileDelete", id: cfgId })
    }];

    if (errors.length > 0) {
        for (const err of errors) {
            console.error(err);
        }
    }

    return (
        <section className="connection-profile invalid">
            <ConnectionProfileHeader
                name={name}
                disabled={disabled}
                state={Proto.ProfileState.PROFILE_IDLE}
                actions={actions}
            />
            <p style={{ textAlign: 'center', margin: 0 }}>{header} Unsupported connection provider</p>
            {errors.map((err, idx) => (
                <p key={idx} style={{ textAlign: 'center', margin: 0, fontWeight: 'bold' }}>
                    {err.message}
                </p>
            ))}

            {hint && (
                <p style={{
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'center'
                }}>Make sure you have the proper Hermes plugins installed</p>
            )}
        </section>
    );
}

function addDictionariesToUiSchema(
    dictionaries: Record<string, Proto.IDictionaryHead>,
    uiSchema: Record<string, any>
) {
    const out: Record<string, any> = JSON.parse(JSON.stringify(uiSchema));

    for (const [key, schema] of Object.entries(out)) {
        if (key.startsWith('ui:')) {
            continue;
        }

        if (schema["ui:widget"] === "dictionary") {
            if (!schema["ui:options"]) {
                schema["ui:options"] = {};
            }

            const dictType = schema["ui:options"]["type"];
            if (dictType) {
                schema["ui:options"]["dictionaries"] = Object.entries(dictionaries).filter(([_, v]) => v.type === dictType);
            } else {
                schema["ui:options"]["dictionaries"] = Object.entries(dictionaries);
            }
        }

        if (schema["properties"]) {
            addDictionariesToUiSchema(dictionaries, schema["properties"]);
        }
    }

    return out;
}


interface ConfigurationProps {
    writeDisabled: boolean;
    profileProviders: Record<string, ProfileProvider>;
    dictionaries: Record<string, Proto.IDictionaryHead>;
    connections: Proto.IFsw[];

    onUpdateConfig: (settings: any) => void;
    cfgId: string;
    cfg: StatefulProfile;
}

const runningRequests = new Map<string, () => void>();
const runtimeProvider: ProfileProvider = {
    name: '',
    schema: {}
};

function Configuration({
    writeDisabled,
    cfg,
    cfgId,
    profileProviders,
    dictionaries,
    connections,
    onUpdateConfig
}: ConfigurationProps) {
    const [isEditing, setIsEditing] = useState<boolean>(cfg.state === Proto.ProfileState.PROFILE_IDLE);
    const [settings, setSettings] = useState(cfg.settings);

    const provider = useMemo<ProfileProvider>(() => cfg.runtimeOnly ?
        runtimeProvider : profileProviders[cfg.provider],
        [profileProviders, cfg.provider, cfg.runtimeOnly]
    );

    useEffect(() => {
        setSettings(cfg.settings);
    }, [cfg.settings]);

    useEffect(() => {
        if (!isEditing && cfg.state === Proto.ProfileState.PROFILE_IDLE) {
            onUpdateConfig(settings);
        }
    }, [isEditing, cfg.state]);

    const actions = useMemo(() => {
        if (cfg.runtimeOnly) {
            return [];
        }

        const out: ActionButtonProps[] = [];
        switch (cfg.state) {
            default:
            case Proto.ProfileState.PROFILE_IDLE:
                // Don't show the connect button if this profile is
                // expecting a dictionary selection
                if (!isEditing) {
                    out.push({
                        title: "Edit",
                        icon: "edit",
                        onClick: () => setIsEditing((oldVal) => !oldVal)
                    });
                    out.push({
                        title: "Connect", icon: "play", onClick: () => {
                            const cancel = messages.postMessage({ type: "profileStart", id: cfgId });
                            runningRequests.set(cfgId, cancel);
                        }
                    });
                    out.push({
                        title: "Delete",
                        icon: "trash",
                        disabled: writeDisabled,
                        onClick: () => messages.postMessage({ type: "profileDelete", id: cfgId })
                    });
                } else {
                    out.push({
                        title: "Save",
                        icon: "check",
                        onClick: () => {
                            setIsEditing((oldVal) => !oldVal);
                        }
                    });
                    out.push({
                        title: "Cancel",
                        icon: "close",
                        onClick: () => {
                            setSettings(cfg.settings);
                            setIsEditing((oldVal) => !oldVal);
                        }
                    });
                }
                break;
            case Proto.ProfileState.PROFILE_DISCONNECT:
            case Proto.ProfileState.PROFILE_CONNECTING:
                out.push({
                    title: "Cancel", icon: "close", onClick: () => {
                        // Cancel the running request
                        runningRequests.get(cfgId)?.();
                    }
                });
                break;
            case Proto.ProfileState.PROFILE_ACTIVE:
                out.push({
                    title: "Stop", icon: "debug-stop", onClick: () => {
                        const cancel = messages.postMessage({ type: "profileStop", id: cfgId });
                        runningRequests.set(cfgId, cancel);
                    }
                });
                break;
        }

        return out;
    }, [cfgId, cfg.state, writeDisabled, isEditing]);

    const activeConnections = useMemo(() => (
        connections.filter((fsw) => fsw.profileId === cfgId).sort((a, b) => a.id?.localeCompare(b.id ?? "") ?? 0)
    ), [connections, cfgId]);

    const uiSchema = useMemo(() => {
        if (provider.uiSchema) {
            return addDictionariesToUiSchema(dictionaries, provider.uiSchema);
        } else {
            return;
        }
    }, [dictionaries, provider]);

    if (cfg.errors) {
        return (
            <InvalidProfile
                cfgId={cfgId}
                header="Invalid profile"
                disabled={writeDisabled}
                name={cfg.name}
                errors={cfg.errors}
            />
        );
    } else if (!provider) {
        return (
            <InvalidProfile
                cfgId={cfgId}
                header="Profile provider does not exist"
                disabled={writeDisabled}
                name={cfg.name}
                errors={[new Error(cfg.provider)]}
            />
        );
    } else if (provider.errors) {
        return (
            <InvalidProfile
                cfgId={cfgId}
                header="Invalid profile provider"
                disabled={writeDisabled}
                name={cfg.name}
                errors={provider.errors}
            />
        );
    }

    const loading = (
        cfg.state === Proto.ProfileState.PROFILE_CONNECTING
        || cfg.state === Proto.ProfileState.PROFILE_DISCONNECT
    );

    return (
        <section key={cfgId} className={"connection-profile" + (cfg.state === Proto.ProfileState.PROFILE_ACTIVE ? " active" : "")}>
            <Progress active={loading} />
            <ConnectionProfileHeader
                name={cfg.name}
                disabled={writeDisabled}
                state={cfg.state}
                actions={actions}
            />
            {(cfg.state === Proto.ProfileState.PROFILE_IDLE || cfg.state === Proto.ProfileState.PROFILE_CONNECTING) &&
                <VSCodeForm widgets={{
                    "dictionary": ({ options, value, onChange, onBlur }: rjsf.WidgetProps<string>) => {
                        const validDictionaries: [string, Proto.IDictionaryHead][] = options["dictionaries"] as any;

                        return (
                            <VSCodeDropdown
                                disabled={!isEditing || cfg.state !== Proto.ProfileState.PROFILE_IDLE || writeDisabled}
                                value={value}
                                onChange={e => {
                                    onChange((e.target as any).value);
                                }}

                                onBlur={() => {
                                    onBlur("", null);
                                }}
                            >
                                <VSCodeOption value={undefined}>No Dictionary</VSCodeOption>
                                {validDictionaries.map(([id, dict]) =>
                                    <VSCodeOption key={id} value={id}>{dict.name} - {dict.version ?? "[version?]"}</VSCodeOption>
                                )}
                            </VSCodeDropdown>
                        );
                    }
                }} disabled={!isEditing || cfg.state !== Proto.ProfileState.PROFILE_IDLE || writeDisabled}
                    formData={settings}
                    formContext={{ cfgId }}
                    onChange={(e) => {
                        if (e.formData && !writeDisabled) {
                            // Update the UI
                            setSettings(e.formData);
                        }
                    }}

                    schema={provider.schema}
                    uiSchema={uiSchema}
                    validator={validator}>
                    <div>
                    </div>
                </VSCodeForm>
            }
            <ActiveConnections connections={activeConnections} />
        </section>
    );
}

export default function ConnectionUi() {
    const [writeDisabled, setWriteDisabled] = useState(false);

    const [profilesList, setProfilesList] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<Record<string, StatefulProfile>>({});
    const [connections, setConnections] = useState<Proto.IFsw[]>([]);
    const [dictionaries, setDictionaries] = useState<Record<string, Proto.IDictionaryHead>>({});

    const [dictionaryProviders, setDictionaryProviders] = useState<string[]>([]);
    const [profileProviders, setProfileProviders] = useState<Record<string, ProfileProvider>>({});

    const [selectedDictionaryProvider, setSelectedDictionaryProvider] = useState<string>();
    const [selectedProfileProvider, setSelectedProfileProvider] = useState<string>();

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

        if (message.profileProviders) {
            setProfileProviders(Object.fromEntries(message.profileProviders.map(p => [
                p.name ?? "[unknown]", profileProviderFromProto(p)
            ])));
        }

        if (message.profiles) {
            setProfiles(Object.fromEntries(
                Object.entries(message.profiles).map(([id, prof]) => [
                    id, statefulProfileFromProto(prof)
                ])
            ));
        }

        if (message.connections) {
            setConnections([...message.connections]);
        }
    }, [selectedDictionaryProvider, selectedProfileProvider]);

    // Hook up the messaging to the message handler
    useEffect(() => {
        messages.onDidReceiveMessage(messageHandler);

        // Get the most up to date schema
        messages.postMessage({ type: 'refresh' });
    }, []);

    useEffect(() => {
        const sortedProfile = Object.entries(profiles).sort(([, profileA], [, profileB]) => profileA.name.localeCompare(profileB.name));
        const newProfilesList1 = [...profilesList];
        let isDifferent = false;
        for (const [profileId,] of sortedProfile) {
            if (!profilesList.includes(profileId)) {
                newProfilesList1.push(profileId);
                isDifferent = true;
            }
        }

        const newProfilesList2 = [];
        for (const profileId of newProfilesList1) {
            if (profiles[profileId] !== undefined) {
                newProfilesList2.push(profileId);
            } else {
                isDifferent = true;
            }
        }

        if (isDifferent) {
            setProfilesList(newProfilesList2);
        }
    }, [profiles]);

    useEffect(() => {
        if (selectedProfileProvider === undefined && profileProviderNames.length > 0) {
            setSelectedProfileProvider(profileProviderNames[0]);
        } else if (profileProviderNames.length === 0) {
            setSelectedProfileProvider(undefined);
        }
    }, [profileProviders]);

    useEffect(() => {
        if (selectedDictionaryProvider === undefined && dictionaryProviders.length > 0) {
            setSelectedDictionaryProvider(dictionaryProviders[0]);
        } else if (dictionaryProviders.length === 0) {
            setSelectedDictionaryProvider(undefined);
        }
    }, [dictionaryProviders]);

    const onCreateNew = useCallback(() => {
        messages.postMessage({ type: "profileNew", provider: selectedProfileProvider! });
    }, [selectedProfileProvider]);

    const onOpenDictionary = useCallback(() => {
        messages.postMessage({ type: "dictionaryOpen", provider: selectedDictionaryProvider! });
    }, [selectedDictionaryProvider]);

    const onProfileUpdate = useCallback((cfgId: string, settings: any) => {
        setProfiles({
            ...profiles,
            [cfgId]: {
                ...profiles[cfgId],
                settings
            }
        });

        messages.postMessage({
            type: "profileUpdate",
            id: cfgId,
            data: settings,
        });
    }, [profiles]);

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

    const profileProviderNames = useMemo(() => {
        return Array.from(Object.keys(profileProviders));
    }, [profileProviders]);

    return (
        <VStack>
            <VStack>
                <Progress active={dictionaryLoading} />
                <VSCodeDropdown
                    value={selectedDictionaryProvider}
                    disabled={dictionaryLoading}
                    onChange={e => setSelectedDictionaryProvider((e.target as any).value)}
                    id="provider-dropdown"
                >
                    {dictionaryProviders.map((v, i) => <VSCodeOption key={i}>{v}</VSCodeOption>)}
                </VSCodeDropdown>
                <VSCodeButton disabled={selectedDictionaryProvider === undefined || dictionaryLoading || writeDisabled} className="full" style={{ maxWidth: "100%" }} appearance="primary" onClick={onOpenDictionary}>
                    Open Dictionary
                    <span slot="start" className="codicon codicon-plus"></span>
                </VSCodeButton>
                {dictionariesElem}
            </VStack>
            <VSCodeDivider />

            <VSCodeDropdown value={selectedProfileProvider} onChange={(e) => setSelectedProfileProvider((e.target as any).value)} id="provider-dropdown">
                {profileProviderNames.map((v, i) => <VSCodeOption key={i}>{v}</VSCodeOption>)}
            </VSCodeDropdown>
            <VSCodeButton
                disabled={selectedProfileProvider === undefined || writeDisabled}
                className="full"
                style={{ maxWidth: "100%" }}
                appearance="primary"
                onClick={onCreateNew}
            >
                Create Profile
                <span slot="start" className="codicon codicon-plus"></span>
            </VSCodeButton>
            <VSCodeDivider />

            {profilesList.map((cfgId) => {
                if (profiles[cfgId]) {
                    return <Configuration
                        key={cfgId}
                        writeDisabled={writeDisabled}
                        profileProviders={profileProviders}
                        dictionaries={dictionaries}
                        connections={connections}
                        onUpdateConfig={(settings) => onProfileUpdate(cfgId, settings)}
                        cfgId={cfgId}
                        cfg={profiles[cfgId]
                        } />;
                }
            })}
        </VStack >
    );
}
