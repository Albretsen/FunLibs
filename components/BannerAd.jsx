import { View } from "react-native";
import { useState } from "react";

export default function BannerAdComponent() {
  const [adStatus, setAdStatus] = useState('loading');

    return(
        <View>
          <FixedButton adStatus={adStatus} />
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