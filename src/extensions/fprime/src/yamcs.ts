import { Def, Dictionary, Proto } from '@gov.nasa.jpl.hermes/types';

/**
 * Builds an F Prime dictionary from YAMCS mode's dictionary for a YAMCS instance
 * that fprime-yamcs runs. fprime-yamcs gives each command a qualified name made
 * of the deployment, the component instance's path and the command's name, like
 * /BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING, and fixes its opcode
 * with an argument assignment called OpCode. So we name each command the way F Prime
 * does, CdhCore.cmdDisp.CMD_NO_OP_STRING, and take its opcode from that assignment.
 * Each command keeps its qualified name in its metadata, since YAMCS mode issues
 * commands by that name.
 *
 * We match each command to its completion event by opcode, so we leave out commands
 * without an OpCode assignment. If no command has one, the instance isn't one
 * fprime-yamcs runs, so we return undefined.
 */
export function fprimeDictionary(yamcs: Proto.IDictionary): Proto.IDictionary | undefined {
    const out = new Dictionary({ name: `${yamcs.head?.name} (F Prime)`, type: 'fprime' });
    const namespace = out.get('');
    let count = 0;
    for (const cmd of Dictionary.fromProto(yamcs).get('').getCommands()) {
        const opcode = cmd.metadata?.assignments?.OpCode;
        if (opcode === undefined) {
            continue;
        }
        // In YAMCS mode's dictionary, a command's component is its qualified name without the command's name, which
        // splits on / into an empty string, the deployment and the component's path
        const component = cmd.component.split('/').slice(2).join('.');
        namespace.addCommand(`${component}.${cmd.mnemonic}`, {
            ...cmd,
            component,
            opcode: Number(opcode),
            arguments: cmd.arguments.map((arg) => ({ ...arg, type: fprimeType(arg.type) })),
        });
        count++;
    }
    return count > 0 ? { ...out.toProto(), id: `${yamcs.id}:fprime` } : undefined;
}

// fprime-yamcs makes F Prime's bool an enumeration called bool, labelled False and True.
// We turn it back into a boolean so cells keep writing true and false.
function fprimeType(type: Def.Type): Def.Type {
    switch (type.kind) {
        case Def.TypeKind.enum:
            return type.name === 'bool' ? { kind: Def.TypeKind.boolean } : type;
        case Def.TypeKind.array:
            return { ...type, type: fprimeType(type.type) };
        case Def.TypeKind.object:
            return { ...type, fields: type.fields.map((field) => ({ ...field, type: fprimeType(field.type) })) };
        default:
            return type;
    }
}
