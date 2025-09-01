import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  droneImage: {
    width: '100%',
    height: 224,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  locationBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
  },
  requestBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestText: {
    color: 'white',
    fontWeight: '700',
  },
  requestButton: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
  },
  requestButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  featuredCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    width: 256,
    marginRight: 12,
  },
  orangeCard: {
    backgroundColor: '#F97316',
  },
  cardTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    color: 'white',
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 4,
  },
  cardButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  orangeButtonText: {
    color: '#F97316',
  },
  termsText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '300',
  },
  weatherSection: {
    padding: 16,
  },
  weatherCard: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 24,
  },
  weatherLoading: {
    alignItems: 'center',
  },
  weatherLoadingText: {
    color: 'white',
    fontWeight: '500',
    marginTop: 8,
  },
  weatherError: {
    alignItems: 'center',
  },
  weatherErrorText: {
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  weatherContent: {
    alignItems: 'center',
  },
  weatherMain: {
    alignItems: 'center',
    marginBottom: 12,
  },
  temperature: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  weatherDescription: {
    color: 'white',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 4,
  },
  detailValue: {
    color: 'white',
    fontWeight: '600',
  },
  weatherEmpty: {
    alignItems: 'center',
  },
  weatherEmptyText: {
    color: 'white',
    fontWeight: '500',
    marginTop: 8,
  },
});