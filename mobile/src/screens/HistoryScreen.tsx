import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { Header } from '../components/Header';
import { useVerifyStore, HistoryItem } from '../store/useVerifyStore';
import { colors } from '../theme/colors';

export const HistoryScreen: React.FC = () => {
  const { history, deleteHistoryItem } = useVerifyStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: HistoryItem }) => {
    let verdictColor = colors.primary;
    if (item.verdict === 'FAKE') verdictColor = colors.verdictFake;
    else if (item.verdict === 'MISLEADING') verdictColor = colors.verdictMisleading;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={[styles.verdictBadge, { color: verdictColor }]}>
            ● {item.verdict} ({item.score}/100)
          </Text>
          <Pressable onPress={() => deleteHistoryItem(item.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </Pressable>
        </View>

        <Text style={styles.claimText} numberOfLines={2}>
          "{item.text}"
        </Text>

        <Text style={styles.summaryText}>{item.summary}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {item.date}</Text>
          <Text style={styles.metaText}>🌐 {item.language}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Verification History" subtitle="Your saved claims and truth checks" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search history..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No verifications saved yet.</Text>
          </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: colors.textPrimary,
    fontSize: 13.5,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verdictBadge: {
    fontSize: 12,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  claimText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 19,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  metaText: {
    fontSize: 11.5,
    color: colors.textMuted,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
