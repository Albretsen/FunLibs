/**
 * @component DrawerHeader
 *
 * @overview
 * A template for the header of drawers
 * Is divided into three sections, all of which are optional
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface DrawerHeaderProps {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    closeSide?: "left" | "right";
    onClose?: () => void;
    closeIcon?: string; // The name of the icon that is shown within the close component
    containerStyle?: StyleProp<ViewStyle>;
}

export default function DrawerHeader({ left = null, center = null, right = null, closeSide = "left", onClose, closeIcon = "arrow-back", containerStyle }: DrawerHeaderProps) {


    const CloseComponent = ({ iconName, style }: {iconName: string; style?: StyleProp<ViewStyle>}) => {
        return(
            <TouchableOpacity onPress={onClose} style={style}>
                <MaterialIcons name={iconName} size={30} />
            </TouchableOpacity>
        )
    }

    return(
        <View style={[styles.header, containerStyle ? containerStyle : null]}>
            {left || closeSide == "left" && (
                <View style={[styles.left]}>
                    {closeSide === "left" ? 
                        <CloseComponent iconName={closeIcon} style={{alignSelf: "flex-start"}}/>
                    :
                        left
                    }
                </View>
            )}
            <View style={[styles.center]}>
                {center}
            </View>
            {right || closeSide == "right" && (
                <View style={[styles.right]}>
                    {closeSide === "right" ? 
                        <CloseComponent iconName={closeIcon} style={{alignSelf: "flex-end"}}/>
                    :
                        right
                    }
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 10,
        justifyContent: "space-between"
    },

    left: {
        flex: 1
    },

    center: {
        flex: 4,
        marginTop: 10,
    },

    right: {
        flex: 1
    }
})