import React from 'react';
import { Share } from 'react-native';

export default class FunLibsShare {
    
    static Share (message, title = "") {
        try {
            const result = Share.share({
                title: title,
                message: message
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("Share: activity type");
                } else {
                    console.log("Share: shared");
                }
            } else if (result.action === Share.dismissedAction) {
                console.log("Share: dismissed");
            }
        } catch (error) {
            console.log("Share: " + error);
        }
    }

}