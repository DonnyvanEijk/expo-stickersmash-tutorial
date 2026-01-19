import EMOJIS from '@/constants/emojis.json';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type EmojiItem = {
  character: string;
  unicodeName: string;
  slug: string;
  group: string;
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
};

export default function EmojiPicker({ isVisible, onClose, onPick }: Props) {
  const [search, setSearch] = useState('');
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchEmojis();
    }
  }, [isVisible]);

  const fetchEmojis = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_EMOJI_API_KEY || 'free';
      const response = await fetch(`https://emoji-api.com/emojis?access_key=${apiKey}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setEmojis(data.slice(0, 500));
      }
    } catch (error) {
      console.log('Failed to fetch emojis from API, using local emojis');
      // Fallback to local emojis
      const localEmojis = EMOJIS.map((char, idx) => ({
        character: char,
        unicodeName: `emoji-${idx}`,
        slug: `emoji-${idx}`,
        group: 'local',
      }));
      setEmojis(localEmojis);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmojis = emojis.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.character.toLowerCase().includes(searchLower) ||
      item.unicodeName.toLowerCase().includes(searchLower) ||
      item.slug.toLowerCase().includes(searchLower) ||
      item.group.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a sticker</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search emojis..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <FlatList
            data={filteredEmojis}
            numColumns={7}
            keyExtractor={(item, index) => `${item.slug}-${index}`}
            contentContainerStyle={styles.emojiGrid}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onPick(item.character);
                  onClose();
                }}
                style={styles.emojiButton}>
                <Text style={styles.emoji}>{item.character}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '100%',
    width: '100%',
    backgroundColor: '#25292e',
    paddingTop: 40,
  },
  titleContainer: {
    height: 60,
    backgroundColor: '#464C55',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#464C55',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emojiButton: {
    flex: 1 / 7,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#464C55',
  },
  emoji: {
    fontSize: 32,
  },
});
