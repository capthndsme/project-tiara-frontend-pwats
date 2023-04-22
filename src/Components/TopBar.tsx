export function TopBar({float, children, leftToRight}: {float?: boolean | undefined, children: React.ReactNode, leftToRight?: boolean}) {
    return (
        <div id="TopBar" className={float?"floatbar":""}>
            <div className={leftToRight?"InnerTopBar LTR":"InnerTopBar"}>
            {children}
            </div>
        </div>
    )
}