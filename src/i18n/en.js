export default {
    // other
    appName: "WhatsApp Status Saver",

    // Titles
    permissionTitle: "WhatsApp Status Saver Storage Permission",
    permissionsDescription: "WhatsApp Status Saver needs access to your Storage so that you can save WhatsApp status to your device.",

    // messages
    statusSaveSuccessMsg: 'Saved to device',
    statusSaveFailureMsg: 'Unable to save the media to device',
    shareFailureMsg: 'Unable to share the media.',

    components: {
        permissionBox: {
            grantedMessage: 'You have given all the required permisisons you can use the app now.',
            deniedMessage: 'You have denied storage permission for this app without which this app cannot function properly.',
        }
    },

    labels: {
        sendFeedback: 'Have any feedback or query ?',
        whatsappStatus: 'WhatsApp Statuses',
        gbWhatsappStatus: 'GBWhatsApp Statuses',
        whatsappBusinessStatus: 'WhatsApp Business Statuses'
    },

    screens: {
        whatsApp: {
            photoStatusTitle: 'Photos',
            videoStatusTitle: 'Videos'
        },
        howtouse: {
            title: 'How To Use',
            steps: '1. Open WhatsApp and watch any status\n\n2. Then come back to this app and open the viewed status\n\n3. Press the save icon to save the status to your device :)',
            faqTitle: 'FAQ',
            faqContent: `1. My status are not displayed in the app:\nThis happens especially for video statuses. Watch the video completely and the check back again.\n\n2. The status I saved is not appearing in the gallery:\nGallery takes a while to load new media from the storage. Just wait for a while, your status is saved already :)\n\n3. Where are the status saved ?\nThe status are saved in the 'WhatsApp Status' folder in your internal storage.\n\n4. How do I save or share multiple status ?\nLong press any status to enter multi select mode. From there you can save or share multiple statuses at once.`
        }
    }
}