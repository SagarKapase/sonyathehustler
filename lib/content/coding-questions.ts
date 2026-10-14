/**
 * One coding question per day, matched to that day's Java topics.
 *
 * Text wrapped in `backticks` renders as inline code. Solutions are
 * intentionally not included.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingQuestion {
  slug: string;
  day: number;
  title: string;
  difficulty: Difficulty;
  /** One-line summary for lists and task rows. */
  summary: string;
  /** Problem statement paragraphs. */
  statement: string[];
  requirements?: string[];
  /** Method signature(s) to implement. */
  signature?: string;
  /** Code showing how the solution is used, with expected results. */
  sampleUsage?: string;
  examples?: QuestionExample[];
  constraints: string[];
  hints: string[];
  followUp?: string;
  concepts: string[];
}

export const CODING_QUESTIONS: CodingQuestion[] = [
  {
    slug: "leap-year-checker",
    day: 1,
    title: "Leap Year Checker",
    difficulty: "Easy",
    summary: "Read a year and decide whether it is a leap year.",
    statement: [
      "Write a program that reads a year from the user and prints whether it is a leap year.",
      "A year is a leap year if it is divisible by 4 — except years divisible by 100, which are not leap years unless they are also divisible by 400.",
    ],
    requirements: [
      "Read a single integer `year` from standard input using `Scanner`",
      "Print exactly `<year> is a leap year` or `<year> is not a leap year`",
      "Decide using arithmetic and logical operators only — no date libraries such as `java.time.Year`",
    ],
    examples: [
      { input: "2024", output: "2024 is a leap year", explanation: "Divisible by 4 and not by 100." },
      {
        input: "1900",
        output: "1900 is not a leap year",
        explanation: "Divisible by 100 but not by 400.",
      },
      { input: "2000", output: "2000 is a leap year", explanation: "Divisible by 400." },
      { input: "2023", output: "2023 is not a leap year", explanation: "Not divisible by 4." },
    ],
    constraints: ["`1 ≤ year ≤ 9999`"],
    hints: [
      "`year % 4 == 0` is true when `year` is divisible by 4.",
      "The whole rule fits in one boolean expression combining `%`, `&&`, `||`, and `!=`.",
      "If you use `if / else if`, check the divisible-by-400 case before the divisible-by-100 case.",
    ],
    followUp: "After Day 2: also print the next leap year after the given year, using a loop.",
    concepts: ["Operators", "Modulo", "Boolean logic", "Scanner"],
  },
  {
    slug: "palindrome-number",
    day: 2,
    title: "Palindrome Number",
    difficulty: "Easy",
    summary: "Check whether an integer reads the same forwards and backwards.",
    statement: [
      "Given an integer `x`, return `true` if `x` is a palindrome — it reads the same from left to right and from right to left — and `false` otherwise.",
      "Solve it with arithmetic only. Do not convert the number to a `String`.",
    ],
    signature: "public static boolean isPalindrome(int x)",
    examples: [
      { input: "x = 121", output: "true" },
      {
        input: "x = -121",
        output: "false",
        explanation: "Left to right it reads -121; right to left it reads 121-.",
      },
      { input: "x = 10", output: "false", explanation: "Reversed it reads 01." },
      { input: "x = 0", output: "true" },
    ],
    constraints: ["`-2³¹ ≤ x ≤ 2³¹ − 1`", "Do not convert `x` to a `String` or `char[]`"],
    hints: [
      "Negative numbers can never be palindromes.",
      "`x % 10` gives the last digit and `x / 10` removes it. Use a loop to build the reversed number.",
      "Reversing a large `int` can overflow — store the reversed value in a `long`.",
    ],
    followUp: "Reverse only half of the digits so that overflow becomes impossible, without using `long`.",
    concepts: ["Loops", "Methods", "Digit manipulation"],
  },
  {
    slug: "valid-anagram",
    day: 3,
    title: "Valid Anagram",
    difficulty: "Easy",
    summary: "Decide whether two strings contain exactly the same letters.",
    statement: [
      "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
      "An anagram uses exactly the same characters as the original, the same number of times, in any order.",
    ],
    signature: "public static boolean isAnagram(String s, String t)",
    examples: [
      { input: 's = "listen", t = "silent"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
      {
        input: 's = "aacc", t = "ccac"',
        output: "false",
        explanation: "s contains two 'a's but t contains only one.",
      },
    ],
    constraints: [
      "`1 ≤ s.length(), t.length() ≤ 5 × 10⁴`",
      "`s` and `t` contain only lowercase English letters",
    ],
    hints: [
      "If the lengths differ, the strings cannot be anagrams.",
      "One approach: convert both to `char[]`, sort them with `Arrays.sort`, and compare with `Arrays.equals`.",
      "A faster O(n) approach: use an `int[26]` — increment counts for `s`, decrement for `t`, then check that every count is zero.",
    ],
    followUp: "What if the strings could contain any Unicode characters? (You'll have the tool for this on Day 6.)",
    concepts: ["Arrays", "Strings", "Frequency counting"],
  },
  {
    slug: "bank-account",
    day: 4,
    title: "Bank Account",
    difficulty: "Easy",
    summary: "Design a class that keeps an account balance safe from invalid changes.",
    statement: [
      "Design a `BankAccount` class that protects its balance. Code outside the class must only be able to change the balance through valid deposits and withdrawals.",
    ],
    requirements: [
      "Private fields: `accountNumber` (`String`), `ownerName` (`String`), `balance` (`double`)",
      "Constructor `BankAccount(String accountNumber, String ownerName, double initialDeposit)` — if `initialDeposit` is negative, throw `new IllegalArgumentException(\"Initial deposit cannot be negative\")`",
      "`boolean deposit(double amount)` — adds `amount` if it is greater than 0 and returns `true`; otherwise returns `false` and leaves the balance unchanged",
      "`boolean withdraw(double amount)` — subtracts `amount` only if it is greater than 0 and not more than the balance; returns whether it succeeded",
      "Getters `getAccountNumber()`, `getOwnerName()`, `getBalance()` — no setter for the balance",
      "`static int getTotalAccounts()` — returns how many accounts have been created",
      "`toString()` returns the format `BankAccount[ACC-001, Asha, balance=1500.00]`",
    ],
    sampleUsage: `BankAccount account = new BankAccount("ACC-001", "Asha", 1000);

account.deposit(500);      // true   → balance 1500.0
account.withdraw(2000);    // false  → balance 1500.0 (insufficient funds)
account.withdraw(-50);     // false  → balance 1500.0 (invalid amount)
account.withdraw(300);     // true   → balance 1200.0

System.out.println(account);              // BankAccount[ACC-001, Asha, balance=1200.00]
System.out.println(BankAccount.getTotalAccounts()); // 1

new BankAccount("ACC-002", "Ravi", -10);  // throws IllegalArgumentException`,
    constraints: [
      "All amounts fit in a `double`",
      "The balance must never become negative",
      "Fields must not be accessible from outside the class",
    ],
    hints: [
      "Making `balance` private and providing no setter is what keeps it safe.",
      "A `private static int` counter incremented in the constructor tracks the total number of accounts.",
      "`String.format(\"%.2f\", balance)` formats the balance with two decimal places.",
    ],
    followUp:
      "Add `boolean transfer(BankAccount to, double amount)` that moves money only if the withdrawal from this account succeeds.",
    concepts: ["Classes", "Constructors", "Encapsulation", "Static members"],
  },
  {
    slug: "shape-area-calculator",
    day: 5,
    title: "Shape Area Calculator",
    difficulty: "Medium",
    summary: "Build a shape hierarchy and use polymorphism to compute areas.",
    statement: [
      "Build a small hierarchy of shapes and use polymorphism to work with them without checking each shape's concrete type.",
    ],
    requirements: [
      "An abstract class `Shape` with abstract methods `double area()` and `double perimeter()`",
      "Subclasses `Circle(double radius)`, `Rectangle(double width, double height)`, and `Triangle(double a, double b, double c)`",
      "Compute the triangle's area with Heron's formula: `s = (a + b + c) / 2`, `area = √(s(s − a)(s − b)(s − c))`",
      "Throw `IllegalArgumentException` for non-positive dimensions, or a triangle whose sides break the triangle inequality",
      "Each `toString()` returns the shape and its area to two decimals, e.g. `Circle[r=2.0] area=12.57`",
      "`static double totalArea(Shape[] shapes)` — sum of all areas",
      "`static Shape largest(Shape[] shapes)` — the shape with the largest area",
      "`totalArea` and `largest` must not use `instanceof` or check concrete types",
    ],
    sampleUsage: `Shape[] shapes = {
    new Circle(2),
    new Rectangle(3, 4),
    new Triangle(3, 4, 5)
};

totalArea(shapes);   // ≈ 30.57  (12.57 + 12.00 + 6.00)
largest(shapes);     // Circle[r=2.0] area=12.57

new Triangle(1, 2, 10);  // throws IllegalArgumentException
new Rectangle(0, 5);     // throws IllegalArgumentException`,
    constraints: [
      "All dimensions are `double` values",
      "Use `Math.PI` and `Math.sqrt`",
      "`shapes` contains at least one element",
    ],
    hints: [
      "Polymorphism means `totalArea` simply calls `shape.area()` — each subclass supplies its own formula.",
      "Sides `a`, `b`, `c` form a valid triangle only if each side is shorter than the sum of the other two.",
      "Validate in each constructor so invalid shapes can never be created.",
    ],
    followUp: "Make `Shape` implement `Comparable<Shape>` (compare by area) and sort the array with `Arrays.sort`.",
    concepts: ["Inheritance", "Abstract classes", "Polymorphism", "Validation"],
  },
  {
    slug: "top-k-frequent-words",
    day: 6,
    title: "Top K Frequent Words",
    difficulty: "Medium",
    summary: "Find the k most frequent words in a paragraph of text.",
    statement: [
      "Given a paragraph of text and an integer `k`, return the `k` most frequent words.",
      "Words are case-insensitive (`The` and `the` are the same word) and punctuation is ignored. Return the words in lowercase, sorted by frequency from highest to lowest. Words with the same frequency are sorted alphabetically.",
    ],
    signature: "public static List<String> topKFrequent(String text, int k)",
    examples: [
      {
        input: 'text = "The cat and the hat. The cat sat!", k = 3',
        output: '["the", "cat", "and"]',
        explanation:
          '"the" appears 3 times and "cat" 2 times. "and", "hat", and "sat" each appear once — "and" comes first alphabetically.',
      },
      {
        input: 'text = "Java is fun, and java is powerful", k = 2',
        output: '["is", "java"]',
        explanation: '"is" and "java" both appear twice, so they are ordered alphabetically.',
      },
      {
        input: 'text = "Hello, hello! HELLO?", k = 5',
        output: '["hello"]',
        explanation: "There are fewer than k distinct words, so all of them are returned.",
      },
      { input: 'text = "Hi", k = 0', output: "throws IllegalArgumentException" },
    ],
    constraints: [
      "`0 ≤ text.length() ≤ 10⁵`",
      "A word is a sequence of English letters (`a–z`, `A–Z`); everything else is a separator",
      "If `k ≤ 0`, throw `IllegalArgumentException`",
      "If `k` is larger than the number of distinct words, return all distinct words",
    ],
    hints: [
      "Normalize first: `text.toLowerCase().split(\"[^a-z]+\")` — and skip any empty strings the split produces.",
      "Count with a `HashMap<String, Integer>`, e.g. `counts.put(word, counts.getOrDefault(word, 0) + 1)`.",
      "Sort the distinct words with a `Comparator`: by count descending, then alphabetically. `Comparator.comparing(...).thenComparing(...)` reads well.",
    ],
    followUp: "Solve it in O(n log k) time using a `PriorityQueue` that never holds more than `k` words.",
    concepts: ["HashMap", "Comparator", "Exceptions", "Strings"],
  },
  {
    slug: "employee-insights",
    day: 7,
    title: "Employee Insights with Streams",
    difficulty: "Medium",
    summary: "Answer reporting questions about employees using only the Stream API.",
    statement: [
      "You are given a list of employees. Implement each reporting method below using the Stream API only — no `for` or `while` loops.",
    ],
    signature: `record Employee(String name, String department, double salary, int age) {}

Map<String, Double> averageSalaryByDepartment(List<Employee> employees)
Optional<Employee>  highestPaid(List<Employee> employees)
List<String>        namesEarningAbove(List<Employee> employees, double threshold)
Map<String, Long>   headcountByDepartment(List<Employee> employees)
String              namesInDepartment(List<Employee> employees, String department)`,
    requirements: [
      "`averageSalaryByDepartment` — average salary for each department",
      "`highestPaid` — the employee with the highest salary, or an empty `Optional` for an empty list",
      "`namesEarningAbove` — names of employees earning strictly more than `threshold`, sorted alphabetically",
      "`headcountByDepartment` — number of employees in each department",
      "`namesInDepartment` — names in the given department, sorted by salary (highest first), joined with `\", \"`",
    ],
    sampleUsage: `List<Employee> employees = List.of(
    new Employee("Asha",  "Engineering",  95000, 29),
    new Employee("Ravi",  "Engineering", 120000, 35),
    new Employee("Meera", "Design",       70000, 26),
    new Employee("Karan", "Sales",        60000, 41),
    new Employee("Neha",  "Design",       82000, 31)
);

averageSalaryByDepartment(employees);
// {Engineering=107500.0, Design=76000.0, Sales=60000.0}   (map order may vary)

highestPaid(employees);
// Optional[Employee[name=Ravi, department=Engineering, salary=120000.0, age=35]]

namesEarningAbove(employees, 80000);
// [Asha, Neha, Ravi]

headcountByDepartment(employees);
// {Engineering=2, Design=2, Sales=1}   (map order may vary)

namesInDepartment(employees, "Design");
// "Neha, Meera"`,
    constraints: [
      "Use streams only — no `for`, `while`, or `forEach` with side effects",
      "Methods must not modify the input list",
      "`highestPaid` of an empty list returns `Optional.empty()`",
    ],
    hints: [
      "`Collectors.groupingBy(Employee::department, Collectors.averagingDouble(Employee::salary))`",
      "`max(Comparator.comparingDouble(Employee::salary))` already returns an `Optional`.",
      "Chain `filter` → `map` → `sorted` → `toList()` for the names list.",
      "`Collectors.counting()` and `Collectors.joining(\", \")` cover the last two methods.",
    ],
    followUp:
      "Return the name of the department with the highest average salary in a single stream pipeline.",
    concepts: ["Lambdas", "Stream API", "Collectors", "Optional", "Records"],
  },
];

export function getQuestionBySlug(slug: string) {
  return CODING_QUESTIONS.find((question) => question.slug === slug);
}
