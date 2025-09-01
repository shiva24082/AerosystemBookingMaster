import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  Share,
  Alert,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'ka', label: 'ಕನ್ನಡ' },
  { code: 'ma', label: 'मराठी' },
  { code: 'pu', label: 'ਪੰਜਾਬੀ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
];

const ARTICLES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    title: 'article1.title',
    department: 'article1.department',
    date: 'article1.date',
    tags: ['article1.tag1', 'article1.tag2', 'article1.tag3'],
    body: ['article1.body1', 'article1.body2'],
    author: 'article1.author',
    readTime: '5 min read',
    likes: 42,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    title: 'article2.title',
    department: 'article2.department',
    date: 'article2.date',
    tags: ['article2.tag1', 'article2.tag2'],
    body: ['article2.body1', 'article2.body2', 'article2.body3'],
    author: 'article2.author',
    readTime: '7 min read',
    likes: 18,
  },
];

const ReadScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(ARTICLES[0].likes);
  const [likeAnimation] = useState(new Animated.Value(1));
  const pan = useRef(new Animated.ValueXY()).current;
  const { height, width } = Dimensions.get('window');
  const swipeThreshold = width * 0.3;

  useEffect(() => {
    setLikeCount(ARTICLES[currentArticleIndex].likes);
    setLiked(false);
  }, [currentArticleIndex]);

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.5,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => (newLiked ? prev + 1 : prev - 1));
    animateLike();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > swipeThreshold && ARTICLES.length > 1) {
          loadNextArticle();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const loadNextArticle = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: height },
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setCurrentArticleIndex(prev => (prev + 1) % ARTICLES.length);
      setBookmarked(false);
    });
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    Alert.alert(
      bookmarked ? t('removedBookmark') : t('addedBookmark'),
      bookmarked ? t('articleRemoved') : t('articleSaved'),
    );
  };

  const shareArticle = async () => {
    try {
      const article = ARTICLES[currentArticleIndex];
      await Share.share({
        title: t(article.title),
        message: `${t(article.title)}\n\n${t(article.body[0])?.substring(
          0,
          100,
        )}...\n\n${t('shareMore')}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const currentArticle = ARTICLES[currentArticleIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>{t('Read Page')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.articleContainer,
          { transform: [{ translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
      >
        <ScrollView>
          <Image
            source={{ uri: currentArticle.image }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.title}>{t(currentArticle.title)}</Text>

            <View style={styles.metaContainer}>
              <Text style={styles.department}>
                {t(currentArticle.department)}
              </Text>
              <View style={styles.metaDivider} />
              <Text style={styles.date}>
                {t(currentArticle.date)} • {t(currentArticle.readTime)}
              </Text>
            </View>

            <Text style={styles.author}>
              {t('by')} {t(currentArticle.author)}
            </Text>

            <View style={styles.tags}>
              {currentArticle.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {t(tag)}
                </Text>
              ))}
            </View>

            {currentArticle.body.map((paragraph, index) => (
              <Text key={index} style={styles.body}>
                {t(paragraph)}
              </Text>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                <Icon
                  name={liked ? 'heart' : 'heart'}
                  size={24}
                  color={liked ? '#FF4081' : '#777'}
                />
              </Animated.View>
              <Text style={[styles.actionText, liked && styles.likedText]}>
                {likeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleBookmark}
            >
              <Icon
                name={bookmarked ? 'bookmark' : 'bookmark'}
                size={24}
                color={bookmarked ? '#4CAF50' : '#777'}
              />
              <Text style={styles.actionText}>
                {bookmarked ? t('bookmarked') : t('bookmark')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={shareArticle}
            >
              <Icon name="share-2" size={24} color="#777" />
              <Text style={styles.actionText}>{t('share')}</Text>
            </TouchableOpacity>
          </View>

          {ARTICLES.length > 1 && (
            <View style={styles.swipeIndicator}>
              <Icon name="chevrons-down" size={24} color="#4CAF50" />
              <Text style={styles.swipeText}>{t('swipeForMore')}</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalItem}
                onPress={() => {
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  articleContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    lineHeight: 30,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  department: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  date: {
    color: '#777',
    fontSize: 14,
  },
  author: {
    color: '#777',
    fontSize: 14,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E0F2E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    color: '#2e7d32',
  },
  body: {
    marginBottom: 20,
    color: '#444',
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionText: {
    color: '#555',
    fontSize: 14,
  },
  likedText: {
    color: '#FF4081',
    fontWeight: 'bold',
  },
  swipeIndicator: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  swipeText: {
    color: '#4CAF50',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ReadScreen;
