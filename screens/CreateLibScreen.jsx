import React, { useContext, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import ButtonPair from '../components/ButtonPair';
import globalStyles from "../styles/globalStyles";
import Lib from "../scripts/lib";
import LibManager from "../scripts/lib_manager";
import ToastContext from '../components/Toast/ToastContext';

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libTitle, setLibTitle] = useState("");
    const showToast = useContext(ToastContext);

    const saveLib = () => {
        let lib = Lib.createLib(libText, libTitle);
        LibManager.storeLib(lib, "yourLibs");
        showToast('Lib saved', 'Your lib can be found under "Your libs" at the bottom of your screen.');
    }

    return(
        <View>
            <View style={{marginHorizontal: 14, flex: 1}}>
                <Text>This is content inside the drawer.</Text>
                <TextInput
                    style={[globalStyles.input, globalStyles.inputSmall]}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={text => setLibTitle(text)}
                />
                <TextInput
                    style={[globalStyles.input, globalStyles.inputLarge, {flex: 1}]}
                    multiline={true}
                    numberOfLines={20}
                    onChangeText={text => setLibText(text)}
                />
            </View>
            <ButtonPair firstLabel="Cancel" secondLabel="Save" secondOnPress={saveLib} bottomButtons={true} />
        </View>
    )
}