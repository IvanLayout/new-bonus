(function () {
    const MIN_COL_WIDTH = 60;
    let resizeTimer;

    function ColumnResizer(table, sortable) {
        this.table = table;
        this.sortable = sortable;
        this.init();
    }

    ColumnResizer.prototype.init = function () {
        this.destroy();

        const ths = this.table.querySelectorAll("th");
        ths.forEach(th => this.createResizer(th));
    };

    ColumnResizer.prototype.createResizer = function (th) {
        if (th.classList.contains('no-resize')) return;

        const resizer = document.createElement("div");
        resizer.className = "info-table__resize";
        th.style.position = "relative";
        th.appendChild(resizer);

        let startX, startWidth;

        resizer.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (this.sortable) {
                this.sortable.option("disabled", true);
            }

            startX = e.pageX;
            startWidth = th.offsetWidth;

            const resize = (e) => {
                let newWidth = startWidth + (e.pageX - startX);

                // 🔒 мінімальна ширина
                if (newWidth < MIN_COL_WIDTH) {
                    newWidth = MIN_COL_WIDTH;
                }

                th.style.width = newWidth + "px";
            };

            const stop = () => {
                if (this.sortable) {
                    this.sortable.option("disabled", false);
                }

                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(() => {
                    saveTableState(this.table);
                }, 50);

                document.removeEventListener("mousemove", resize);
                document.removeEventListener("mouseup", stop);
            };

            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stop);
        });
    };

    ColumnResizer.prototype.destroy = function () {
        this.table.querySelectorAll(".resizer").forEach(r => r.remove());
    };

    window.ColumnResizer = ColumnResizer;
})();
