/* global hexo*/
'use strict';

const assign = Object.assign;
function addCount(array, searchProperty, newProperty) {
  return array.reduce((newArray, item) => {
    const i = objectArrayIndexOf(newArray, item[searchProperty], searchProperty);
    if (i === -1) {
      item[newProperty] = 1;
      newArray.push(item);
    } else {
      newArray[i][newProperty] = newArray[i][newProperty] + 1;
    }
    return newArray;
  }, []);
}
function objectArrayIndexOf(array, searchTerm, property) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === searchTerm) { return i; }
  }
  return -1;
}
function dynamicSort(property, isAscending) {
  let sortOrder = -1;
  if (isAscending) { sortOrder = 1; }
  return function(a, b) {
    if (a[property] < b[property]) {
      return -1 * sortOrder;
    } else if (a[property] > b[property]) {
      return 1 * sortOrder;
    }
    return 0 * sortOrder;
  };
}
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function listRelatedPosts(_post, options, _hexo) {
  if (!options) {
    options = {};
  }
  options = assign({
    maxCount: 5,
    orderBy: 'date',
    isAscending: false
  }, options);
  const orderOption = ['date', 'random'];
  if (orderOption.indexOf(options.orderBy) === -1) {
    options.orderBy = 'date';
  }
  let postList = [];
  // console.log(_post.tags);
  _post.tags.each(tag => {
    tag.posts.each(post => {
      postList.push(post);
    });
  });
  postList = addCount(postList, '_id', 'count');
  const thisPostPosition = objectArrayIndexOf(postList, _post._id, '_id');
  postList.splice(thisPostPosition, 1);
  if (options.orderBy === 'random') {
    shuffle(postList);
  } else {
    postList.sort(dynamicSort(options.orderBy, options.isAscending));
  }
  postList.sort(dynamicSort('count', false));
  return postList;
}

hexo.extend.helper.register('list_related_posts', (post, options, hexo) => {
  return listRelatedPosts(post, options, hexo);
});
