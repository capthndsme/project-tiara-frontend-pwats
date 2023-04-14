export function TopBar({float, children}: {float?: boolean | undefined, children: React.ReactNode}) {
    return (
        <div id="TopBar" className={float?"floatbar":""}>
            <div id="InnerTopBar">
            {children}
            </div>
        </div>
    )
}