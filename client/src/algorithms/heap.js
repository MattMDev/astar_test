// TODO: implement heap class using a binary tree form

class Heap {
  constructor(maxHeapSize) {
    this.items = [maxHeapSize];
    this.currentItemCount = 0;
  }

  addItem(item) {
    // Add item to heap
    item.heapIndex = this.currentItemCount;
    this.items[this.currentItemCount] = item;
    this.sortUp(item);
    this.currentItemCount++;
  }

  removeFirst() {
    const first = this.items[0];
    this.currentItemCount--;
    this.items[0] = this.currentItemCount;
    this.items[0].heapIndex = 0;
    this.sortDown(first);
    return first;
  }

  updateItem(item) {
    this.sortUp(item);
  }

  get count() {
    return this.currentItemCount;
  }

  contains(item) {
    // make sure the item is indeed in its' place
    return this.items[item.heapIndex] === item;
  }

  sortDown(item) {
    while (true) {
      // calculate left child index
      const leftChildIndex = item.heapIndex * 2 + 1;
      const rightChildIndex = item.heapIndex * 2 + 2;

      let swapIndex = 0;

      // check for existence of left child (if doesn't exists then there aren't any children)
      if (leftChildIndex >= this.currentItemCount) {
        break;
      }

      swapIndex = leftChildIndex;

      if (rightChildIndex < this.currentItemCount) {
        // if right child has lower f cost, take its' index
        if (this.items[rightChildIndex].f < this.items[leftChildIndex].f) {
          swapIndex = rightChildIndex;
        }
      }
      // if children have higher or equal f costs, do not perform swap
      if (this.items[swapIndex] >= item) {
        break;
      }
      this.swapItems(item, this.items[swapIndex]);
    }
  }

  sortUp(item) {
    // Sort an existing item in the heap using the heap index formula
    let parentIndex = (item.heapIndex - 1) / 2;

    // while parent index is not 1 (the head parent)
    while (true) {
      // save parent item
      let parentItem = this.items[parentIndex];

      // compare f costs, if item has higher f cost, stop the loop
      if (item.f >= parentItem.f) {
        break;
      }

      //otherwise, swap items and continue the search
      this.swapItems(item, parentItem);

      // check for next parent
      parentIndex = (item.heapIndex - 1) / 2;
    }
  }

  swapItems(itemA, itemB) {
    // swap places in the array
    this.items[itemA.heapIndex] = itemB.heapIndex;
    this.items[itemB.heapIndex] = itemA.heapIndex;

    // swap heap indexes
    const temp = itemA.heapIndex;
    itemA.heapIndex = itemB.heapIndex;
    itemB.heapIndex = temp;
  }
}
