CLASS Bag<T>
    DECLARE map counts (stores each item and its frequency)
    DECLARE integer size (total number of items in bag)

    METHOD add(item: T)
        IF item exists in counts
            increment count for item
        ELSE
            add item with count = 1
        increment size

    METHOD remove(item: T)
        IF item not in counts
            RETURN
        IF count of item == 1
            remove item from counts
        ELSE
            decrement count of item
        decrement size

    METHOD contains(item: T): boolean
        RETURN true if item exists in counts
        ELSE return false

    METHOD count(item: T): integer
        RETURN count of item if it exists
        ELSE return 0

    METHOD size(): integer
        RETURN size

    METHOD toString(): string
        RETURN string representation of all items with their counts

END CLASS


MAIN PROGRAM (BagDemo)
    CREATE new Bag<String> called votes
    ADD "A", "B", "A", "C", "B", "A"
    PRINT bag contents
    PRINT total size
    TEST contains("A") and contains("D")
    TEST count("A"), count("B"), count("D")

    REMOVE one "B"
    PRINT bag contents
    PRINT total size
    TEST contains("B") and count("B")
END PROGRAM
