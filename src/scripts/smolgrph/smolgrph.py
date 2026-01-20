#!/usr/bin/env python3

import select
import termios
import time
import tty
from typing import cast, Dict, Tuple, List, Union
import sqlite3
import argparse
from collections import defaultdict
from datetime import datetime, timedelta, timezone, tzinfo
import sys

from termcolor import colored

Metrics = Dict[str, Tuple[List[datetime], List[float]]]


def getch(timeout: float) -> Union[str, None]:
    fd = sys.stdin
    old_settings = termios.tcgetattr(fd)
    ch = None
    try:
        tty.setraw(fd)
        rs, _, _ = select.select([fd], [], [], timeout)
        if rs:
            ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)

    return ch


def term_plot_metrics(metrics: Metrics, redraw: bool = False) -> None:
    import plotext as plot

    _, h = plot.plot_size()
    if redraw:
        move_cursor_up(h + 1)
    plot.cld()
    plot.date_form(input_form="m/d/Y H:M:S")
    plot.theme("pro")
    for name, (x, y) in metrics.items():
        x = plot.datetimes_to_string(x)
        plot.plot(x, y, label=name, marker="fhd")

    plot.show()


def move_cursor_up(n):
    sys.stdout.write(f"\033[{n}A\r")
    sys.stdout.flush()


def matplot_plot_metrics(metrics: Metrics, redraw: bool = False) -> None:
    from matplotlib.figure import Figure
    from matplotlib.backends.backend_agg import FigureCanvasAgg
    import matplotlib.pyplot as plt
    from PIL import Image
    from term_image.image import AutoImage
    from term_image.utils import get_cell_size, get_terminal_size

    plt.style.use("dark_background")
    tx, ty = get_terminal_size()
    ty -= 1

    if redraw:
        move_cursor_up(ty + 1)

    cx, cy = get_cell_size() or (7, 16)
    dpi = 96
    fig = Figure(figsize=((tx * cx) / dpi, (ty * cy) / dpi), dpi=dpi)
    canvas = FigureCanvasAgg(fig)

    ax = fig.add_subplot()

    for name, (x, y) in metrics.items():
        ax.plot(x, y, label=name)

    fig.legend()
    canvas.draw()
    w, h = canvas.get_width_height()
    im = Image.frombuffer("RGBA", (w, h), cast(bytes, canvas.buffer_rgba()))
    tm = AutoImage(im, width=tx, height=ty)
    tm.draw()


def query_metrics(
    database: str,
    component: Union[str, None],
    names: Union[List[str], None],
    start: Union[str, None],
    minutes: Union[int, None],
) -> Metrics:

    con = sqlite3.connect(database)
    # con.set_trace_callback(print)
    # if this fails we don't actually care
    con.execute("PRAGMA journal_mode=WAL;")

    component_clause = f"component = :component" if component else ""

    if names:
        name_clauses = (
            "("
            + " OR ".join(
                (f"name LIKE :name{i}" if "%" in name else f"name = :name{i}")
                for i, name in enumerate(names)
            )
            + ")"
        )
    else:
        name_clauses = ""

    if start:
        start_time = datetime.strptime(start, "%m/%d/%Y %H:%M:%S").replace(
            tzinfo=timezone.utc
        )
        start_timestamp = start_time.timestamp() * 1000
        start_clause = "time >= :start"
        if minutes:
            minute_clause = "time <= :start + (60 * :minutes * 1000)"
        else:
            minute_clause = ""
    else:
        if minutes:
            start_time = datetime.now(tz=timezone.utc) - timedelta(
                minutes=int(minutes), seconds=(minutes % 1) * 60
            )
            start_timestamp = start_time.timestamp() * 1000
            start_clause = "time >= :start" if minutes else ""
        else:
            start_timestamp = None
            start_clause = ""
        minute_clause = ""
    full_clauses = [
        clause
        for clause in [component_clause, name_clauses, start_clause, minute_clause]
        if clause
    ]
    clauses = "WHERE " + " AND ".join(full_clauses) if full_clauses else ""

    template = f"""
    SELECT time, component, name, valueType, integral, floating
    FROM telemetryDefs AS telDef
    INNER JOIN telemetry AS tel ON telDef.id = telemetryDefId
         {clauses};
    """

    name_args = {f"name{i}": name for i, name in enumerate(names)} if names else {}
    args = {"component": component, "start": start_timestamp, "minutes": minutes}
    args.update(name_args)

    try:
        res = con.execute(
            template,
            args,
        )
    except sqlite3.OperationalError as e:
        raise RuntimeError(template) from e

    metrics: Metrics = defaultdict(lambda: ([], []))
    for time, component, name, data_type, integral, floating in res:
        key = f"{component}_{name}"
        metrics[key][0].append(datetime.fromtimestamp(time / 1000, tz=timezone.utc))
        if data_type == "float":
            metrics[key][1].append(floating)
        elif data_type == "int" or data_type == "uint":
            metrics[key][1].append(integral)
        else:
            raise SystemExit(f"metric {key} is not floating point or integral!")

    return metrics


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="smolgrph.py",
        description="A minimal graphing tool for visualizing FSW telemetry",
    )
    parser.add_argument(
        "database", help="path to the sqlite database to pull data from"
    )
    parser.add_argument(
        "-i",
        "--image",
        action="store_true",
        help="attempt to use matplotlib graph rendered to the terminal instead of traditional text rendering",
    )
    parser.add_argument(
        "-c", "--component", type=str, help="component to monitor the telemetry of"
    )
    parser.add_argument(
        "-n",
        "--name",
        action="append",
        help="name(s) of the telemetry channels to monitor, supports SQL LIKE syntax",
    )
    parser.add_argument(
        "-t",
        "--minutes",
        type=float,
        help="number of minutes back to visualize data for",
    )
    parser.add_argument("-s", "--start", type=str, help="start time to visualize from")
    parser.add_argument(
        "-r",
        "--refresh",
        type=float,
        help="refresh interval, in seconds (default 2.0)",
        default=2.0,
    )

    return parser.parse_args()


def highlight(text: str) -> str:
    return colored(text, "grey", "on_white")


def mainloop():
    args = parse_args()

    paused = False
    redraw = False
    while True:
        main_start = time.time()

        if not paused:
            query_start = time.perf_counter()
            metrics = query_metrics(
                args.database, args.component, args.name, args.start, args.minutes
            )
            query_end = time.perf_counter()

            draw_start = time.perf_counter()
            (matplot_plot_metrics if args.image else term_plot_metrics)(metrics, redraw)
            redraw = True
            draw_end = time.perf_counter()

            print(
                f"\33[2KQuery time: {(query_end - query_start) * 1000:.2f}ms Draw time {(draw_end - draw_start) * 1000:.2f}ms {highlight('[SPACE]')} pause, {highlight('q')} or {highlight('^C')} quit",
                end="",
            )
            sys.stdout.flush()

        main_end = time.time()
        remaining = args.refresh - (main_end - main_start)
        c = getch(max(remaining, 0))
        if c == "q" or c == "\x03":
            print()
            break
        elif c == " ":
            paused = not paused
            if paused:
                print(" [PAUSED]", end="")
                sys.stdout.flush()


if __name__ == "__main__":
    mainloop()
