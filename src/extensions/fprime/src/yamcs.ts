import { Def, Dictionary, Proto } from '@gov.nasa.jpl.hermes/types';

// Builds an F Prime dictionary from the one YAMCS mode builds for an instance that fprime-yamcs runs
export function fprimeDictionary(yamcsDictionary: Proto.IDictionary): Proto.IDictionary | undefined {
    // fprime-yamcs assigns each command's opcode to an argument called OpCode. F Prime identifies a
    // command by its opcode, so we leave out a command that has no OpCode assignment.
    const commands = [...Dictionary.fromProto(yamcsDictionary).get('').getCommands()]
        .filter((cmd) => cmd.metadata?.assignments?.OpCode !== undefined);
    // If no command has an OpCode assignment, fprime-yamcs doesn't run this instance, so we build no dictionary
    if (commands.length === 0) {
        return undefined;
    }

    const out = new Dictionary({ name: `${yamcsDictionary.head?.name} (F Prime)`, type: 'fprime' });
    for (const cmd of commands) {
        // We name the command the way F Prime does, like CdhCore.cmdDisp.CMD_NO_OP. cmd.component is like
        // /BigData_YamcsDeployment/CdhCore/cmdDisp, so we drop its leading slash and the deployment.
        const component = cmd.component.split('/').slice(2).join('.');
        out.get('').addCommand(`${component}.${cmd.mnemonic}`, {
            // cmd's metadata has the qualified name, which YAMCS mode uses to issue the command
            ...cmd,
            component,
            opcode: Number(cmd.metadata?.assignments?.OpCode),
            arguments: cmd.arguments.map((arg) => ({ ...arg, type: fprimeType(arg.type) })),
        });
    }
    return { ...out.toProto(), id: `${yamcsDictionary.id}:fprime` };
}

function fprimeType(type: Def.Type): Def.Type {
    switch (type.kind) {
        case Def.TypeKind.enum:
            // fprime-yamcs makes F Prime's bool an enumeration called bool, labelled False and True.
            // We turn it back into a boolean so cells keep writing true and false.
            return type.name === 'bool' ? { kind: Def.TypeKind.boolean } : type;
        case Def.TypeKind.array:
            return { ...type, type: fprimeType(type.type) };
        case Def.TypeKind.object:
            return { ...type, fields: type.fields.map((field) => ({ ...field, type: fprimeType(field.type) })) };
        default:
            return type;
    }
}
