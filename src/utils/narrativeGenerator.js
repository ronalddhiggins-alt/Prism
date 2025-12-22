export const generateNarrativeSummary = (article) => {
  if (!article) return "";

  const credLabel =
    article.credibility_score >= 85
      ? "highly credible"
      : article.credibility_score >= 70
        ? "moderately credible"
        : "of questionable credibility";
  const biasLabel =
    article.bias_score < 30
      ? "minimal bias"
      : article.bias_score < 60
        ? "moderate bias"
        : "significant bias";
  const sourceCount = article.sources?.length || 0;
  const leftCount = article.left_coverage || 0;
  const centerCount = article.center_coverage || 0;
  const rightCount = article.right_coverage || 0;

  let coverageDesc = "";
  if (leftCount > centerCount && leftCount > rightCount) {
    coverageDesc = "predominantly covered by left-leaning outlets";
  } else if (rightCount > centerCount && rightCount > leftCount) {
    coverageDesc = "predominantly covered by right-leaning outlets";
  } else if (centerCount > leftCount && centerCount > rightCount) {
    coverageDesc = "mainly covered by center-aligned sources";
  } else {
    coverageDesc = "covered across the political spectrum";
  }

  let narrative = `This story has been rated as **${credLabel}** with a credibility score of ${article.credibility_score}%. `;
  narrative += `Our analysis detected **${biasLabel}** (bias score: ${article.bias_score}/100). `;

  if (sourceCount > 0) {
    narrative += `The story has been ${coverageDesc}, with **${sourceCount} independent sources** providing coverage. `;
    if (leftCount + centerCount + rightCount > 0) {
      narrative += `Coverage breakdown: ${leftCount} left-leaning, ${centerCount} center, and ${rightCount} right-leaning outlets. `;
    }
  } else {
    narrative += `We are currently discovering sources for this story. `;
  }

  if (article.factChecks && article.factChecks.length > 0) {
    const verifiedCount = article.factChecks.filter(
      (fc) => fc.status === "verified",
    ).length;
    const falseCount = article.factChecks.filter(
      (fc) => fc.status === "false",
    ).length;
    const partialCount = article.factChecks.filter(
      (fc) => fc.status === "partially-true",
    ).length;

    narrative += `**${article.factChecks.length} key claims** have been fact-checked`;
    if (verifiedCount > 0) narrative += ` (${verifiedCount} verified`;
    if (partialCount > 0) narrative += `, ${partialCount} partially true`;
    if (falseCount > 0) narrative += `, ${falseCount} false`;
    narrative += `).`;
  }

  return narrative;
};

export const generateKeyDifferences = (article) => {
  if (!article.sources || article.sources.length === 0) {
    return "We're still analyzing source coverage for this story. Check back soon for insights on how different outlets are framing this topic.";
  }

  const leftSources = article.sources.filter((s) => s.bias === "left");
  const centerSources = article.sources.filter((s) => s.bias === "center");
  const rightSources = article.sources.filter((s) => s.bias === "right");

  let narrative = "";

  // Analyze coverage balance
  if (leftSources.length > centerSources.length + rightSources.length) {
    narrative +=
      "This story is **predominantly covered by left-leaning outlets**, which may indicate it aligns with progressive priorities or challenges conservative positions. ";
  } else if (rightSources.length > centerSources.length + leftSources.length) {
    narrative +=
      "This story is **predominantly covered by right-leaning outlets**, which may indicate it aligns with conservative priorities or challenges progressive positions. ";
  } else if (
    centerSources.length > 0 &&
    leftSources.length > 0 &&
    rightSources.length > 0
  ) {
    narrative +=
      "This story has **broad cross-spectrum coverage**, indicating it's a significant topic across the political landscape. ";
  }

  // Analyze framing differences based on headlines
  const leftKeywords = leftSources
    .map((s) => s.headline.toLowerCase())
    .join(" ");
  const rightKeywords = rightSources
    .map((s) => s.headline.toLowerCase())
    .join(" ");

  if (leftSources.length > 0 && rightSources.length > 0) {
    narrative += "\n\n**Left-leaning sources** tend to emphasize ";
    if (
      leftKeywords.includes("climate") ||
      leftKeywords.includes("environment")
    ) {
      narrative += "environmental and climate impacts, ";
    }
    if (leftKeywords.includes("rights") || leftKeywords.includes("justice")) {
      narrative += "social justice and rights issues, ";
    }
    narrative += "while **right-leaning sources** often focus on ";
    if (
      rightKeywords.includes("economy") ||
      rightKeywords.includes("business")
    ) {
      narrative += "economic implications and business impacts, ";
    }
    if (
      rightKeywords.includes("freedom") ||
      rightKeywords.includes("liberty")
    ) {
      narrative += "individual freedom and regulatory concerns, ";
    }
  }

  if (centerSources.length > 0) {
    narrative +=
      "\n\n**Center sources** typically provide more balanced framing, focusing on factual reporting and multiple stakeholder perspectives.";
  }

  // Add credibility note
  const avgCredibility =
    article.sources.reduce((sum, s) => sum + s.credibility, 0) /
    article.sources.length;
  if (avgCredibility >= 80) {
    narrative += `\n\nOverall source credibility is **high** (${Math.round(avgCredibility)}% average), lending strong reliability to this coverage.`;
  } else if (avgCredibility >= 60) {
    narrative += `\n\nOverall source credibility is **moderate** (${Math.round(avgCredibility)}% average). Cross-reference with primary sources when possible.`;
  } else {
    narrative += `\n\n⚠️ Overall source credibility is **lower than ideal** (${Math.round(avgCredibility)}% average). Exercise caution and verify claims independently.`;
  }

  return narrative;
};
