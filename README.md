# 🧠 Algorithm Visualizer

An interactive and educational platform built using **Next.js** that visually demonstrates how popular algorithms work step-by-step. Ideal for students, educators, and developers who want to learn, teach, or reinforce algorithmic thinking with animated, real-time visualizations.

---

## 🚀 Features

- 🎨 Intuitive animations to understand sorting and searching algorithms
- 🧑‍💻 User authentication (sign up & log in)
- ⚙️ Customizable array size and animation speed
- 📈 Real-time visual feedback for better algorithm comprehension

---

## ✅ Algorithms Implemented (Phase 1)

### 🔁 Sorting Algorithms

1. **Bubble Sort**
   - Compares adjacent elements and swaps them if out of order
   - Repeats until the entire array is sorted
   - Time Complexity: O(n²)

2. **Selection Sort**
   - Finds the minimum element and places it at the correct position in each pass
   - Time Complexity: O(n²)

3. **Insertion Sort**
   - Builds the final sorted array one item at a time
   - Shifts elements to make space for the new item
   - Time Complexity: O(n²)

4. **Merge Sort**
   - Divide-and-conquer algorithm
   - Recursively splits the array and merges them in sorted order
   - Time Complexity: O(n log n)

5. **Quick Sort**
   - Divide-and-conquer using a pivot
   - Partitions the array into subarrays around the pivot and sorts them recursively
   - Time Complexity: O(n log n) on average

---

### 🔍 Searching Algorithm

6. **Binary Search**
   - Efficient search on a sorted array
   - Repeatedly divides the search space in half
   - Time Complexity: O(log n)

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Visualization Library**: [D3.js](https://d3js.org/)
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based login & registration
- **Database**: MongoDB (with Mongoose)
- **Deployment**: Vercel

---

## 📅 Roadmap (Next Phase)

- Add more algorithms:
  - DFS, BFS (Graph Traversal)
  - Dijkstra’s Algorithm
  - Heap Sort, Counting Sort, Radix Sort
  - Linear Search
- User dashboard for tracking activity
- Theme customization (dark/light)
- Code snippet generator with explanations

---

## 📬 Contribute

If you want to contribute, feel free to fork the repo and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
