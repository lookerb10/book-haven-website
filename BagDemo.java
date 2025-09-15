/*
 * Author: Brandon Looker
 * Course: CSC400 Data Structures and Algorithms
 * Assignment: Critical Thinking – Java Bag Data Structure
 * Date: September 2025
 *
 * Description:
 * This program implements a Bag data structure (multiset) in Java.
 * The Bag allows duplicates, does not enforce order, and provides
 * operations for adding, removing, checking existence, and counting
 * occurrences of elements. A demo in the main method shows the Bag in use.
 */

import java.util.HashMap;
import java.util.Map;

/**
 * Generic Bag class implementing a multiset data structure.
 * Allows duplicate elements and does not enforce any particular order.
 * @param <T> the type of elements stored in this bag
 */
class Bag<T> {
    // HashMap to store each unique item and its frequency count
    private Map<T, Integer> counts;
    // Total number of items in the bag (including duplicates)
    private int size;

    /**
     * Constructs an empty bag.
     */
    public Bag() {
        counts = new HashMap<>();
        size = 0;
    }

    /**
     * Adds an item to the bag. If the item already exists,
     * its count is incremented by 1.
     * @param item the item to add to the bag
     */
    public void add(T item) {
        counts.put(item, counts.getOrDefault(item, 0) + 1);
        size++;
    }

    /**
     * Removes one occurrence of the specified item from the bag.
     * If the item doesn't exist, no action is taken.
     * @param item the item to remove from the bag
     */
    public void remove(T item) {
        // Check if item exists in the bag
        if (!counts.containsKey(item)) return;

        // If only one occurrence, remove the item completely
        if (counts.get(item) == 1) {
            counts.remove(item);
        } else {
            // Otherwise, decrement the count
            counts.put(item, counts.get(item) - 1);
        }
        size--;
    }

    /**
     * Checks if the bag contains the specified item.
     * @param item the item to check for
     * @return true if the item exists in the bag, false otherwise
     */
    public boolean contains(T item) {
        return counts.containsKey(item);
    }

    /**
     * Returns the number of occurrences of the specified item in the bag.
     * @param item the item to count
     * @return the number of times the item appears in the bag (0 if not present)
     */
    public int count(T item) {
        return counts.getOrDefault(item, 0);
    }

    /**
     * Returns the total number of items in the bag (including duplicates).
     * @return the size of the bag
     */
    public int size() {
        return size;
    }

    /**
     * Returns a string representation of the bag contents.
     * Shows each unique item and its count.
     * @return string representation of the bag
     */
    @Override
    public String toString() {
        if (counts.isEmpty()) {
            return "[]";
        }
        
        StringBuilder sb = new StringBuilder("[");
        for (Map.Entry<T, Integer> entry : counts.entrySet()) {
            sb.append(entry.getKey()).append(" x").append(entry.getValue()).append(", ");
        }
        // Remove the trailing comma and space
        sb.setLength(sb.length() - 2);
        sb.append("]");
        return sb.toString();
    }
}

/**
 * Demonstration class showing the functionality of the Bag data structure.
 */
public class BagDemo {
    public static void main(String[] args) {
        System.out.println("=== Java Bag Data Structure Demo ===\n");
        
        // Create an instance of the Bag class
        Bag<String> votes = new Bag<>();

        // Add several elements to the bag, including duplicates
        System.out.println("Adding votes: A, B, A, C, B, A");
        votes.add("A");
        votes.add("B");
        votes.add("A");
        votes.add("C");
        votes.add("B");
        votes.add("A");

        // Print the bag contents
        System.out.println("Initial votes: " + votes);
        System.out.println("Total ballots: " + votes.size());
        System.out.println();

        // Test the contains method for a few elements
        System.out.println("=== Testing contains() method ===");
        System.out.println("Contains A? " + votes.contains("A"));
        System.out.println("Contains D? " + votes.contains("D"));
        System.out.println();

        // Test the count method for a few elements
        System.out.println("=== Testing count() method ===");
        System.out.println("Count of A: " + votes.count("A"));
        System.out.println("Count of B: " + votes.count("B"));
        System.out.println("Count of C: " + votes.count("C"));
        System.out.println("Count of D: " + votes.count("D"));
        System.out.println();

        // Remove an element from the bag
        System.out.println("=== Removing one 'B' ===");
        votes.remove("B");
        
        // Print the bag contents again
        System.out.println("Votes after removal: " + votes);
        System.out.println("Total ballots: " + votes.size());
        System.out.println();

        // Test the contains method for the removed element
        System.out.println("=== Testing after removal ===");
        System.out.println("Contains B? " + votes.contains("B"));
        
        // Test the count method for the removed element
        System.out.println("Count of B: " + votes.count("B"));
        
        // Additional demonstration - remove all B's
        System.out.println("\nRemoving the last 'B':");
        votes.remove("B");
        System.out.println("Votes: " + votes);
        System.out.println("Contains B? " + votes.contains("B"));
        System.out.println("Count of B: " + votes.count("B"));
    }
}