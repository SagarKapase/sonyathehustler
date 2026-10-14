/**
 * The 7-day Java roadmap: what to learn each day.
 *
 * Topic ids are persisted in localStorage as completed tasks, so keep them
 * stable once published. Text wrapped in `backticks` renders as inline code.
 */

export interface JavaTopic {
  id: string;
  title: string;
  summary: string;
  points: string[];
}

export interface JavaDay {
  day: number;
  title: string;
  /** Short label for compact places like the timeline. */
  shortTitle: string;
  goal: string;
  topics: JavaTopic[];
  /** Slug of the coding question assigned for this day. */
  questionSlug: string;
}

export const JAVA_DAYS: JavaDay[] = [
  {
    day: 1,
    title: "Java Fundamentals",
    shortTitle: "Fundamentals",
    goal: "Write, compile, and run Java programs that read input, compute with variables, and print results.",
    questionSlug: "leap-year-checker",
    topics: [
      {
        id: "java-d1-how-java-runs",
        title: "How Java runs",
        summary: "JDK, JRE, JVM, and the compile → bytecode → run cycle.",
        points: [
          "Install a current LTS JDK (Java 21 or 25) and an IDE such as IntelliJ IDEA Community",
          "Difference between the JDK, JRE, and JVM; what bytecode is and why Java is platform-independent",
          "Compile and run from the terminal with `javac Main.java` and `java Main`",
          "Anatomy of `public static void main(String[] args)`; one public class per file, named after the file",
        ],
      },
      {
        id: "java-d1-variables-types",
        title: "Variables & data types",
        summary: "Primitive types, reference types, and constants.",
        points: [
          "The 8 primitive types: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean` — and their ranges",
          "Primitive vs reference types; `String` is a reference type",
          "Local type inference with `var`; constants with `final`",
          "Naming conventions: `camelCase` variables, `PascalCase` classes, `UPPER_SNAKE_CASE` constants",
        ],
      },
      {
        id: "java-d1-operators",
        title: "Operators & type conversion",
        summary: "Arithmetic, logical, and relational operators, and casting.",
        points: [
          "Arithmetic, relational, logical, and compound assignment operators; prefix vs postfix `++`/`--`",
          "Integer division and the `%` (modulo) operator; operator precedence",
          "Widening (implicit) vs narrowing (explicit cast) conversion; integer overflow",
          "Short-circuit evaluation with `&&` and `||`",
        ],
      },
      {
        id: "java-d1-console-io",
        title: "Console input & output",
        summary: "Printing formatted output and reading user input.",
        points: [
          "`System.out.println`, `print`, and `printf` / `String.format` with format specifiers like `%d`, `%.2f`, `%s`",
          "Reading input with `Scanner` (`nextInt`, `nextDouble`, `nextLine`)",
          "The leftover-newline gotcha when mixing `nextInt()` and `nextLine()`",
          "Single-line, multi-line, and Javadoc comments",
        ],
      },
    ],
  },
  {
    day: 2,
    title: "Control Flow & Methods",
    shortTitle: "Control Flow",
    goal: "Control program flow with conditions and loops, and organize logic into reusable methods.",
    questionSlug: "palindrome-number",
    topics: [
      {
        id: "java-d2-conditionals",
        title: "Conditionals",
        summary: "Branching with if/else, the ternary operator, and switch.",
        points: [
          "`if` / `else if` / `else` and nested conditions",
          "The ternary operator: `condition ? a : b`",
          "The classic `switch` statement and fall-through",
          "Modern switch expressions with `->` and `yield`",
        ],
      },
      {
        id: "java-d2-loops",
        title: "Loops",
        summary: "Repeating work with for, while, and do-while.",
        points: [
          "`for`, `while`, and `do-while` — and when to use each",
          "`break`, `continue`, and labeled breaks for nested loops",
          "Common patterns: counting, accumulating, and extracting digits with `% 10` and `/ 10`",
          "Avoiding infinite loops and off-by-one errors",
        ],
      },
      {
        id: "java-d2-methods",
        title: "Methods",
        summary: "Declaring, calling, and overloading methods.",
        points: [
          "Method anatomy: return type, parameters, `void`, and `return`",
          "Method overloading (same name, different parameter lists)",
          "Java is always pass-by-value — what that means for primitives vs object references",
          "Variable scope, and calling `static` methods from `main`",
        ],
      },
      {
        id: "java-d2-recursion",
        title: "Recursion basics",
        summary: "Methods that call themselves.",
        points: [
          "Base case and recursive case",
          "Tracing recursive calls: factorial, Fibonacci, sum of digits",
          "The call stack and `StackOverflowError`",
        ],
      },
    ],
  },
  {
    day: 3,
    title: "Arrays & Strings",
    shortTitle: "Arrays & Strings",
    goal: "Store and process groups of values with arrays, and manipulate text correctly and efficiently.",
    questionSlug: "valid-anagram",
    topics: [
      {
        id: "java-d3-arrays",
        title: "Arrays",
        summary: "Fixed-size, indexed collections of values.",
        points: [
          "Declaring, creating, and initializing arrays; default values",
          "Indexing, `length`, and `ArrayIndexOutOfBoundsException`",
          "Iterating with a classic `for` loop and the enhanced `for-each` loop",
          "2D arrays (matrices) and nested loops",
        ],
      },
      {
        id: "java-d3-array-techniques",
        title: "Array techniques",
        summary: "The `Arrays` utility class and common algorithms.",
        points: [
          "`Arrays.toString`, `Arrays.sort`, `Arrays.fill`, `Arrays.copyOf`, `Arrays.equals`",
          "Linear search, finding min/max, and reversing in place with two pointers",
          "Frequency counting with an `int[]`, e.g. `count[c - 'a']++`",
        ],
      },
      {
        id: "java-d3-strings",
        title: "Strings",
        summary: "Immutable text and its most useful methods.",
        points: [
          "String immutability and the String pool; why `==` and `.equals()` differ",
          "`length`, `charAt`, `substring`, `indexOf`, `contains`, `split`, `strip`, `toLowerCase`, `replace`",
          "`char` arithmetic and `Character` helpers (`isLetter`, `isDigit`, `toLowerCase`)",
          "Converting between `String`, `char[]`, and numbers (`toCharArray`, `Integer.parseInt`, `String.valueOf`)",
        ],
      },
      {
        id: "java-d3-stringbuilder",
        title: "StringBuilder & text blocks",
        summary: "Building strings efficiently.",
        points: [
          "Why `+=` on a String inside a loop is slow",
          "`StringBuilder`: `append`, `insert`, `reverse`, `deleteCharAt`, `toString`",
          "Text blocks (`\"\"\"`) for readable multi-line strings",
        ],
      },
    ],
  },
  {
    day: 4,
    title: "OOP: Classes & Encapsulation",
    shortTitle: "OOP Basics",
    goal: "Model real-world entities as classes with protected state and clear, validated behavior.",
    questionSlug: "bank-account",
    topics: [
      {
        id: "java-d4-classes-objects",
        title: "Classes & objects",
        summary: "Blueprints, instances, and references.",
        points: [
          "A class is a blueprint; an object is an instance created with `new`",
          "Fields (instance variables) and instance methods",
          "References, `null`, and `NullPointerException`",
          "Mental model: objects live on the heap, local variables and references on the stack",
        ],
      },
      {
        id: "java-d4-constructors",
        title: "Constructors & `this`",
        summary: "Creating objects in a valid state.",
        points: [
          "Default and parameterized constructors",
          "Constructor overloading and chaining with `this(...)`",
          "Using `this` to tell fields apart from parameters",
          "Validating arguments in constructors so objects can't start in a broken state",
        ],
      },
      {
        id: "java-d4-encapsulation",
        title: "Encapsulation & access modifiers",
        summary: "Hiding state behind a clear public interface.",
        points: [
          "`private`, package-private (no modifier), `protected`, and `public`",
          "Getters and setters — and when not to expose a setter",
          "Immutable objects with `private final` fields",
          "Packages and `import`",
        ],
      },
      {
        id: "java-d4-static-records",
        title: "Static members & records",
        summary: "Class-level state and concise data classes.",
        points: [
          "`static` fields and methods vs instance members",
          "Static counters and utility classes like `Math`",
          "Records — `record Point(int x, int y)` — for simple immutable data",
          "Overriding `toString()` for readable output",
        ],
      },
    ],
  },
  {
    day: 5,
    title: "OOP: Inheritance, Polymorphism & Interfaces",
    shortTitle: "OOP Advanced",
    goal: "Build class hierarchies, program to abstractions, and use polymorphism to write flexible code.",
    questionSlug: "shape-area-calculator",
    topics: [
      {
        id: "java-d5-inheritance",
        title: "Inheritance",
        summary: "Reusing and specializing behavior with `extends`.",
        points: [
          "`extends`, the “is-a” relationship, and single inheritance of classes",
          "`super(...)` constructor calls and `super.method()`",
          "Method overriding with `@Override`; overriding vs overloading",
          "`final` classes and methods; why composition is often preferred over inheritance",
        ],
      },
      {
        id: "java-d5-polymorphism",
        title: "Polymorphism",
        summary: "One reference type, many runtime behaviors.",
        points: [
          "Parent reference, child object: `Shape s = new Circle(2);`",
          "Dynamic method dispatch (runtime polymorphism)",
          "Upcasting, downcasting, and `instanceof` with pattern matching: `if (s instanceof Circle c)`",
        ],
      },
      {
        id: "java-d5-abstraction",
        title: "Abstract classes & interfaces",
        summary: "Defining contracts and shared behavior.",
        points: [
          "Abstract classes and abstract methods",
          "Interfaces, `implements`, and implementing multiple interfaces",
          "`default` and `static` methods in interfaces",
          "Choosing between an abstract class and an interface",
          "`sealed` types (Java 17+) to restrict which classes can extend a type",
        ],
      },
      {
        id: "java-d5-object-class",
        title: "The `Object` class",
        summary: "Methods every Java object inherits.",
        points: [
          "`toString()`, `equals()`, and `hashCode()` — and the contract between `equals` and `hashCode`",
          "Why overriding `equals` without `hashCode` breaks `HashMap` and `HashSet`",
          "`Comparable<T>` and `compareTo` for natural ordering",
        ],
      },
    ],
  },
  {
    day: 6,
    title: "Exceptions, Generics & Collections",
    shortTitle: "Collections",
    goal: "Handle errors gracefully and choose the right data structure from the Collections Framework.",
    questionSlug: "top-k-frequent-words",
    topics: [
      {
        id: "java-d6-exceptions",
        title: "Exception handling",
        summary: "Detecting, reporting, and recovering from errors.",
        points: [
          "The hierarchy: `Throwable`, `Error`, `Exception`; checked vs unchecked exceptions",
          "`try` / `catch` / `finally` and multi-catch",
          "`throw` vs `throws`; writing a custom exception class",
          "`try-with-resources` and `AutoCloseable`",
        ],
      },
      {
        id: "java-d6-generics",
        title: "Generics & wrapper types",
        summary: "Type-safe, reusable code.",
        points: [
          "Why generics: compile-time type safety without casts",
          "Generic classes and methods: `Box<T>`, `<T> T first(List<T> items)`",
          "Wrapper classes and autoboxing (`int` ↔ `Integer`) — and the `Integer ==` pitfall",
          "Bounded types and wildcards: `<T extends Comparable<T>>`, `List<? extends Number>`",
        ],
      },
      {
        id: "java-d6-lists-sets",
        title: "Lists & sets",
        summary: "Ordered sequences and unique elements.",
        points: [
          "The Collections Framework: `Collection`, `List`, `Set`, `Queue`, and `Map`",
          "`ArrayList` vs `LinkedList` — performance trade-offs",
          "`HashSet`, `LinkedHashSet`, `TreeSet` — uniqueness and ordering",
          "Iterating safely: `ConcurrentModificationException` and `Iterator.remove()`",
        ],
      },
      {
        id: "java-d6-maps-sorting",
        title: "Maps, queues & sorting",
        summary: "Key–value lookups, stacks, queues, and ordering.",
        points: [
          "`HashMap`, `LinkedHashMap`, `TreeMap`; `getOrDefault`, `putIfAbsent`, `merge`, `entrySet`",
          "How `HashMap` works internally: hashing, buckets, and the role of `equals`/`hashCode`",
          "`ArrayDeque` as a stack or queue; `PriorityQueue` as a heap",
          "Sorting with `Collections.sort`, `Comparator.comparing`, `reversed`, and `thenComparing`",
        ],
      },
    ],
  },
  {
    day: 7,
    title: "Modern Java: Lambdas & Streams",
    shortTitle: "Streams",
    goal: "Write concise, expressive Java with lambdas, the Stream API, and Optional — then consolidate the week.",
    questionSlug: "employee-insights",
    topics: [
      {
        id: "java-d7-lambdas",
        title: "Lambdas & functional interfaces",
        summary: "Passing behavior as a value.",
        points: [
          "From anonymous classes to lambda expressions",
          "Built-in functional interfaces: `Predicate`, `Function`, `Consumer`, `Supplier`, `BiFunction`",
          "Method references: `String::length`, `System.out::println`, `Employee::salary`",
          "Why captured variables must be effectively final",
        ],
      },
      {
        id: "java-d7-streams",
        title: "Stream API",
        summary: "Declarative data processing pipelines.",
        points: [
          "Creating streams from collections, arrays, and `Stream.of`",
          "Intermediate operations: `filter`, `map`, `sorted`, `distinct`, `limit`",
          "Terminal operations: `forEach`, `collect`, `toList`, `reduce`, `count`, `anyMatch`, `max`",
          "Collectors: `groupingBy`, `counting`, `averagingDouble`, `toMap`, `joining`",
          "Laziness, and why a stream can't be reused",
        ],
      },
      {
        id: "java-d7-optional-modern",
        title: "Optional & modern Java",
        summary: "Safer null handling and newer language features.",
        points: [
          "`Optional`: `of`, `ofNullable`, `map`, `orElse`, `orElseThrow` — and when not to use it",
          "Pattern matching for `switch` with records and sealed types (Java 21)",
          "Immutable collections with `List.of`, `Set.of`, `Map.of`",
        ],
      },
      {
        id: "java-d7-review",
        title: "Week review & what's next",
        summary: "Consolidate what you learned and plan ahead.",
        points: [
          "Revisit every topic you marked as stuck in your daily updates",
          "Re-solve one earlier coding question using streams and compare the two versions",
          "Beyond this week: multithreading and concurrency, JVM memory and garbage collection, file I/O, and unit testing with JUnit",
        ],
      },
    ],
  },
];
