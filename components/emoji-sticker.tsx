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
                scaleSticker.value = imageSize * 2;
            } else {
                scaleSticker.value = imageSize;
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
            <Animated.View style={[containerStyle, { position: 'absolute', top: 0, left: 0 }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Text style={[imageStyle, { fontSize: imageSize }]}>{stickerSource}</Animated.Text>
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
}


