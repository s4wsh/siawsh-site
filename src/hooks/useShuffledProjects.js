import { useMemo } from 'react';
import { projectsData } from '../data/projectsData.js';

/**
 * Fisher-Yates Shuffle Algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Custom Hook: Returns randomized projects pinned by preferred category
 * @param {string} priorityCategory - Category to prioritize at the top (e.g. 'spatial')
 */
export function useShuffledProjects(priorityCategory = 'spatial') {
  return useMemo(() => {
    // Separate into priority group and secondary group
    const priorityGroup = projectsData.filter((p) =>
      p.categoryType?.includes(priorityCategory)
    );
    const secondaryGroup = projectsData.filter(
      (p) => !p.categoryType?.includes(priorityCategory)
    );

    // Randomize order within each group independently
    const randomizedPriority = shuffleArray(priorityGroup);
    const randomizedSecondary = shuffleArray(secondaryGroup);

    // Combine so priority category always appears first, but internal order is randomized
    return [...randomizedPriority, ...randomizedSecondary];
  }, [priorityCategory]);
}