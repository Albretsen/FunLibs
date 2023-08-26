import { View } from "react-native";
import { useState, useEffect, useContext } from "react";
import FixedButton from './FixedButton';
import { ScreenContext } from '../App';

export default function BannerAdComponent() {
  const { currentScreenName } = useContext(ScreenContext);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [buttonBottom, setButtonBottom] = useState(20);

  useEffect(() => {
    if (["LibsScreen", "StoriesScreen", "YourLibsScreen"].includes(currentScreenName)) {
      setShowFixedButton(true);
    } else {
      setShowFixedButton(false);
    }
  }, [currentScreenName, showFixedButton])

  return (
    <View>
      {/* {showFixedButton && (
        <FixedButton buttonBottom={buttonBottom} />
      )} */}
    </View>
  )
}
/**

<BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />

*/