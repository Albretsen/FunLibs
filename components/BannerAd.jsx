import { View } from "react-native";
import { useState } from "react";
import FixedButton from './FixedButton';

export default function BannerAdComponent() {
  const [buttonBottom, setButtonBottom] = useState(20);

    return(
          <FixedButton buttonBottom={buttonBottom} />
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