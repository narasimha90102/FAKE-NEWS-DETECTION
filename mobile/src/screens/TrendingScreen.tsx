import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { Header } from '../components/Header';
import { colors } from '../theme/colors';

interface TrendingItem {
  id: string;
  headline: string;
  tag: 'fake' | 'misleading' | 'satire';
  score: number;
  date: string;
  spread: string;
  category: string;
}

const TRENDING_DATA: TrendingItem[] = [
  { id: '1', headline: 'Government announces free smartphones for all BPL families under new scheme', tag: 'misleading', score: 18, date: '2 hrs ago', spread: '4.2K shares', category: 'Government' },
  { id: '2', headline: 'New COVID variant causes instant blindness within 48 hours — health alert', tag: 'fake', score: 4, date: '5 hrs ago', spread: '12.1K shares', category: 'Health' },
  { id: '3', headline: 'RBI to fully replace physical cash with digital rupee by January 2026', tag: 'misleading', score: 31, date: '8 hrs ago', spread: '2.8K shares', category: 'Finance' },
  { id: '4', headline: 'Famous actor donating ₹10 crore to flood victims — viral WhatsApp message', tag: 'fake', score: 9, date: '10 hrs ago', spread: '7.5K shares', category: 'Celebrity' },
  { id: '5', headline: 'Onion prices set to drop to ₹2/kg after government intervention', tag: 'satire', score: 45, date: '1 day ago', spread: '1.3K shares', category: 'Economy' },
  { id: '6', headline: '5G towers are causing widespread illness across South India, doctors warn', tag: 'fake', score: 7, date: '1 day ago', spread: '9.2K shares', category: 'Technology' },
];

export const TrendingScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredData = TRENDING_DATA.filter((item) =>
    selectedTag === 'all' ? true : item.tag === selectedTag
  );

  const renderItem = ({ item }: { item: TrendingItem }) => {
    let tagBg = 'rgba(239, 68, 68, 0.15)';
    let tagColor = colors.verdictFake;
    if (item.tag === 'misleading') {
      tagBg = 'rgba(245, 158, 11, 0.15)';
      tagColor = colors.verdictMisleading;
    } else if (item.tag === 'satire') {
      tagBg = 'rgba(168, 85, 247, 0.15)';
      tagColor = colors.verdictSatire;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.tagBadge, { backgroundColor: tagBg }]}>
            <Text style={[styles.tagText, { color: tagColor }]}>{item.tag.toUpperCase()}</Text>
          </View>
          <Text style={styles.scoreText}>Score: {item.score}/100</Text>
        </View>

        <Text style={styles.headline}>{item.headline}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>📅 {item.date}</Text>
          <Text style={styles.footerText}>🔥 {item.spread}</Text>
          <Text style={styles.footerText}>🏷️ {item.category}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Trending Claims" subtitle="Real-time viral news verification feed" />

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {['all', 'fake', 'misleading', 'satire'].map((t) => (
          <Pressable
            key={t}
            style={[styles.chip, selectedTag === t && styles.chipActive]}
            onPress={() => setSelectedTag(t)}
          >
            <Text style={[styles.chipText, selectedTag === t && styles.chipTextActive]}>
              {t.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.cardBgSolid,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scoreText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headline: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerText: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
});
