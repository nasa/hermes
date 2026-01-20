import { Proto } from '@gov.nasa.jpl.hermes/types';

export interface ProfileProvider {
    name: string;
    schema: any;
    uiSchema?: any;

    errors?: Error[];
}

export function profileProviderFromProto(provider: Proto.IProfileProvider): ProfileProvider {
    const errors: Error[] = [];

    let schema;
    try {
        schema = JSON.parse(provider.schema ?? '{}');
    } catch (err) {
        errors.push(new Error(`failed to load profile schema: ${err}`));
    }

    let uiSchema;
    try {
        uiSchema = JSON.parse(provider.uiSchema ?? '{}');
    } catch (err) {
        errors.push(new Error(`failed to load profile uiSchema: ${err}`));
    }

    return {
        name: provider.name ?? '[unknown]',
        schema,
        uiSchema,
        errors: errors.length > 0 ? errors : undefined,
    };
}

export interface StatefulProfile {
    name: string;
    provider: string;
    settings: any;

    state: Proto.ProfileState;
    runtimeOnly: boolean;

    errors?: Error[];
}

export function statefulProfileFromProto(profile: Proto.IStatefulProfile): StatefulProfile {
    const errors: Error[] = [];
    if (!profile.value?.provider && !profile.runtimeOnly) {
        errors.push(new Error('profile has no provider'));
    }

    let settings;
    try {
        settings = JSON.parse(profile.value?.settings ?? '{}');
    } catch (err) {
        errors.push(new Error(`failed to load profile settings: ${err}`));
    }

    return {
        name: profile.value?.name ?? '[unknown]',
        provider: profile.value?.provider ?? '',
        settings,
        state: profile.state ?? Proto.ProfileState.PROFILE_IDLE,
        runtimeOnly: profile.runtimeOnly ?? false,
        errors: errors.length > 0 ? errors : undefined,
    };
}
