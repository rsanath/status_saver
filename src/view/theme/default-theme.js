const colors = {
    primaryLight: "#00766a",
    primary: '#075e55',
    primaryDark: "#054c44",
    accent: '#fff',
    textColor: '#000',
    componentColor: '#000',
    componentFgColor: '#fff'
};

export default {
    colors,
    screens: {
        global: {
            backgroundColor: '#ffffff'
        },
        whatsapp: {
            backgroundColor: '#fff',
            statusBarColor: '#161616',
            statusBarSelectionModeColor: '#eeeeee',
            refreshColor: colors.componentColor,
            itemHighlightColor: 'rgba(0,0,0,0.7)',
            titleBarBgColor: colors.componentColor,
            titleBarFgColor: colors.componentFgColor,

            mediaViewerHeaderFooterColor: 'rgba(0,0,0,0.3)',
            mediaViewerBgColor: colors.componentColor,
            mediaViewerFgColor: colors.componentFgColor
        }
    },
    containers: {
        screen: {
            flex: 1
        }
    }
};