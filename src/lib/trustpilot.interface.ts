export interface TrustpilotResponse {
  domain: string;
  pageUrl: string;
  businessUnit: BusinessUnit;
  reviews: Review[];
  relevantReviews: RelevantReview[];
  products: null;
  filters: Filters;
  seoData: SeoData;
  aiSummary: AiSummary;
  showAdvertisement: boolean;
  showProductReviews: boolean;
  similarBusinessUnits: SimilarBusinessUnit[];
  noIndex: boolean;
  sidebarData: SidebarData;
  newrelicBrowserTimingHeader: string;
}

export interface SidebarData {
  facebookBox: FacebookBox;
  infoBusinessUnitBox: InfoBusinessUnitBox;
  locationsBox: LocationsBox;
  similarBusinessUnitsBox: SimilarBusinessUnitsBox;
}

interface SimilarBusinessUnitsBox {
  businessUnitTier: string;
  activelyInvitingStatusCode: number;
}

interface LocationsBox {
  topLocations: any[];
}

interface InfoBusinessUnitBox {
  hasCompanyElements: boolean;
  promotion: Promotion;
  contact: Contact;
  guarantee: Guarantee;
  businessUnitCountry: string;
  categories: Category2[];
  descriptionText: null;
  informationSource: string;
}

interface Category2 {
  id: string;
  breadcrumb: Breadcrumb2;
  isPrimary: boolean;
  ranking: Ranking;
  hasRanking: boolean;
  isBadCategory: boolean;
}

interface Ranking {
  position: number;
  cardinality: number;
}

interface Breadcrumb2 {
  name: string;
  localizedName: string;
}

interface Guarantee {
  display: boolean;
  header: null;
  teaser: null;
  html: null;
  image: null;
}

interface Contact {
  email: null;
  phone: null;
  address: null;
  zipCode: null;
  city: null;
  country: string;
}

interface Promotion {
  logo: null;
  title: null;
  sellingPoints: any[];
}

interface FacebookBox {
  show: boolean;
  facebookPageId: null;
  facebookPageUrl: null;
}

interface SimilarBusinessUnit {
  businessUnitId: string;
  businessUnitDisplayName: string;
  businessUnitIdentifyingName: string;
  businessUnitLogo: string;
  numberOfReviews: number;
  stars: number;
  statusCode: number;
  tier: string;
  trustScore: number;
  consumerAlert: null;
}

interface AiSummary {
  id: string;
  businessunitid: string;
  lang: string;
  modelVersion: string;
  status: string;
  summary: string;
  updatedAt: string;
}

interface SeoData {
  locale: string;
  canonicalUrl: string;
  languages: Language[];
  domain: string;
}

interface Language {
  languageCode: string;
  isoLanguage: string;
  uri: string;
  locale: string;
}

export interface Filters {
  hasActiveFilters: boolean;
  totalNumberOfReviews: number;
  totalNumberOfFilteredReviews: number;
  pagination: Pagination;
  selected: Selected;
  reviewStatistics: ReviewStatistics;
}

export interface ReviewStatistics {
  hasMultipleLanguages: boolean;
  reviewLanguages: ReviewLanguage[];
  ratings: Ratings;
}

interface Ratings {
  total: number;
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}

interface ReviewLanguage {
  isoCode: string;
  reviewCount: number;
  displayName: string;
}

interface Selected {
  languages: string;
  date: null;
  stars: null;
  aspects: null;
  topics: null;
  search: null;
  locationId: null;
  sort: string;
  verified: boolean;
  replies: boolean;
}

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface RelevantReview {
  id: string;
  filtered: boolean;
  pending: boolean;
  text: string;
  rating: number;
  labels: Labels;
  title: string;
  likes: number;
  source: string;
  dates: Dates2;
  report: null;
  hasUnhandledReports: boolean;
  consumer: Consumer;
  reply: null;
  consumersReviewCountOnSameDomain: number;
  consumersReviewCountOnSameLocation: null;
  productReviews: any[];
  language: string;
  location: null;
}

interface Dates2 {
  experiencedDate: string;
  publishedDate: string;
  updatedDate: null;
  submittedDate: null;
}

export interface Review {
  id: string;
  filtered: boolean;
  pending: boolean;
  text: string;
  rating: number;
  labels: Labels;
  title: string;
  likes: number;
  source: string;
  dates: Dates;
  report: null;
  hasUnhandledReports: boolean;
  consumer: Consumer;
  reply: null;
  consumersReviewCountOnSameDomain: number;
  consumersReviewCountOnSameLocation: null;
  productReviews: any[];
  language: string;
  location: null;
}

export interface Consumer {
  id: string;
  displayName: string;
  imageUrl: string;
  numberOfReviews: number;
  countryCode: string;
  hasImage: boolean;
  isVerified: boolean;
}

export interface Dates {
  experiencedDate: string;
  publishedDate: string;
  updatedDate: null | string;
  submittedDate: null;
}

export interface Labels {
  merged: null;
  verification: Verification2;
}

interface Verification2 {
  isVerified: boolean;
  createdDateTime: string;
  reviewSourceName: string;
  verificationSource: string;
  verificationLevel: string;
  hasDachExclusion: boolean;
}

export interface BusinessUnit {
  id: string;
  displayName: string;
  identifyingName: string;
  numberOfReviews: number;
  trustScore: number;
  websiteUrl: string;
  websiteTitle: string;
  profileImageUrl: string;
  customHeaderUrl: string;
  promotion: null;
  hideCompetitorModule: boolean;
  stars: number;
  categories: Category[];
  breadcrumb: Breadcrumb;
  isClaimed: boolean;
  isClosed: boolean;
  isTemporarilyClosed: boolean;
  locationsCount: number;
  isCollectingReviews: boolean;
  verification: Verification;
  hasCollectedIncentivisedReviews: boolean;
  consumerAlert: null;
  consumerAlerts: any[];
  isMerged: boolean;
  contactInfo: ContactInfo;
  activity: Activity;
  hasCustomHeaderSetting: boolean;
  hasPromotionSetting: boolean;
}

interface Activity {
  isUsingPaidFeatures: boolean;
  hasSubscription: boolean;
  isAskingForReviews: boolean;
  claimedDate: null;
  isClaimed: boolean;
  previouslyClaimed: boolean;
  replyBehavior: ReplyBehavior;
  verification: Verification;
  hasBusinessUnitMergeHistory: boolean;
  basiclinkRate: number;
  hideBasicLinkAlert: boolean;
  isUsingAIResponses: boolean;
}

interface ReplyBehavior {
  averageDaysToReply: number;
  lastReplyToNegativeReview: null;
  negativeReviewsWithRepliesCount: number;
  replyPercentage: number;
  totalNegativeReviewsCount: number;
}

interface ContactInfo {
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  zipCode: string;
}

interface Verification {
  verifiedByGoogle: boolean;
  verifiedPaymentMethod: boolean;
  verifiedUserIdentity: boolean;
}

interface Breadcrumb {
  topLevelId: string;
  topLevelDisplayName: string;
  midLevelId: string;
  midLevelDisplayName: string;
  bottomLevelId: string;
  bottomLevelDisplayName: string;
}

interface Category {
  id: string;
  name: string;
  rank: string;
  cardinality: string;
  isPrimary: boolean;
}
