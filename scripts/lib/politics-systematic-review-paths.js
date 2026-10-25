const assert = require('node:assert/strict');

function buildLessonReviewPaths(source, displayTitleForLessonId) {
  const groupByLessonId = new Map();
  for (const group of source.groups) {
    for (const lessonId of group.lessonIds) {
      assert.equal(groupByLessonId.has(lessonId), false, `${lessonId} belongs to multiple groups`);
      groupByLessonId.set(lessonId, group);
    }
  }

  const routeByGroupId = new Map();
  for (const route of source.routes) {
    for (const groupId of route.groupIds) {
      assert.equal(routeByGroupId.has(groupId), false, `${groupId} belongs to multiple routes`);
      routeByGroupId.set(groupId, route);
    }
  }

  return Object.fromEntries(source.lessons.map(lesson => {
    const group = groupByLessonId.get(lesson.id);
    const route = group && routeByGroupId.get(group.id);
    assert.ok(group, `${lesson.id} has no group`);
    assert.ok(route, `${lesson.id} has no route`);
    const lessonTitle = displayTitleForLessonId(lesson.id);
    assert.ok(lessonTitle, `${lesson.id} has no display title`);
    return [lesson.id, {
      routeId: route.id,
      routeTitle: route.title,
      groupId: group.id,
      groupTitle: group.title,
      lessonId: lesson.id,
      lessonTitle,
      displayPath: `${route.title}-${group.title}-${lessonTitle}`,
    }];
  }));
}

module.exports = { buildLessonReviewPaths };
