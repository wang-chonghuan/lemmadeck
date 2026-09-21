function preserveExerciseMetadata(exercises, existingDeck, editionName) {
  if (
    existingDeck?.edition !== editionName
    || !Array.isArray(existingDeck.exercises)
  ) {
    return exercises
  }

  const previousByNumber = new Map(
    existingDeck.exercises.map((exercise) => [String(exercise.number), exercise]),
  )
  return exercises.map((exercise) => {
    const previous = previousByNumber.get(String(exercise.number))
    return {
      ...exercise,
      ...(previous?.answerKey ? { answerKey: previous.answerKey } : {}),
      ...(previous?.interaction ? { interaction: previous.interaction } : {}),
    }
  })
}

function sourceNumberForArtifact(exercise) {
  return Object.prototype.hasOwnProperty.call(exercise, 'source_number')
    ? exercise.source_number
    : exercise.number
}

module.exports = { preserveExerciseMetadata, sourceNumberForArtifact }
