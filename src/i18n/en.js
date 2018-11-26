export default {
    // other
    appName: "WhatsApp Status Saver",

    // Titles
    permissionTitle: "WhatsApp Status Saver Storage Permission",
    perissionDescription: "WhatsApp Status Saver needs access to your Storage so you can save WhatsApp status to your device.",

    // messages
    statusSaveSuccessMsg: 'Saved to device',
    statusSaveFailureMsg: 'Unable to save the image to device',
    shareFailureMsg: 'Unable to share the media.',

    components: {
        permissionBox: {
            grantedMessage: 'You have given all the required permisisons you can use the app now.',
            deniedMessage: 'You have denied storage permission for this app without which this app cannot function properly.',
        }
    }


}