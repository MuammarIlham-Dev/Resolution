const VOTER_KEY = 'resolution-comment-voter';

/** Stable per-browser id for comment like deduplication (not security). */
export function getCommentVoterId(): string {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id = `v_${crypto.randomUUID()}`;
      localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}
