# Hermes YAMCS

Send YAMCS commands from Hermes notebooks.

In a Hermes notebook (`.hermes.md`), set a code cell's language to **YAMCS** and write one command per
line: its qualified name, then its arguments. Lines starting with `#` are comments.

```
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP
/BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello"
```

Switch Hermes to YAMCS mode (**Hermes: Change Backend Mode**, then **YAMCS**) first. Completion,
hovers and argument checks come from the dictionary YAMCS mode builds from the instance's commands, so
they start working once YAMCS mode connects. Running a cell sends its commands through YAMCS, one at a
time, and the cell passes once YAMCS has sent them all, which doesn't mean the flight software ran
them. The yamcs-grpc plugin's [README](https://github.com/nasa/hermes/tree/v6/yamcs-grpc-plugin)
explains YAMCS mode.
