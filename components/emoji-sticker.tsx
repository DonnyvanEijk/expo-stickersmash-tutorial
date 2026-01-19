import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
    imageSize: number;
    stickerSource: string;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
    const scaleSticker = useSharedValue(imageSize)

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if (scaleSticker.value !== imageSize * 2) {
                scaleSticker.value = scaleSticker.value * 2;
            } else {
                scaleSticker.value = Math.round(scaleSticker.value / 2);
            }
        });

    const drag = Gesture.Pan().onChange(event => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });



    const imageStyle = useAnimatedStyle(() => {
        return {
            fontSize: withSpring(scaleSticker.value),
        };
    });



    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Text style={[imageStyle, { fontSize: imageSize }]}>{stickerSource}</Animated.Text>
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
}


