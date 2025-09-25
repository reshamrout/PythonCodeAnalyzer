
import ast
import subprocess
import tempfile
import os
from radon.complexity import cc_visit


def estimate_complexity(code):
    time_complexity = "O(1)"
    space_complexity = "O(1)"
    try:
        tree = ast.parse(code)
    except Exception:
        return time_complexity, space_complexity

    loop_count = 0
    recursive_funcs = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.While)):
            loop_count += 1
        elif isinstance(node, ast.FunctionDef):
            for subnode in ast.walk(node):
                if isinstance(subnode, ast.Call) and isinstance(subnode.func, ast.Name):
                    if subnode.func.id == node.name:  
                        recursive_funcs.append(node.name)

    if recursive_funcs:
        time_complexity = "O(2^n)" 
    elif loop_count == 1:
        time_complexity = "O(n)"
    elif loop_count == 2:
        time_complexity = "O(n^2)"
    elif loop_count >=3:
        time_complexity = "O(n^3)"

    if "list(" in code or "dict(" in code or "[0]*" in code:
        space_complexity = "O(n)"

    return time_complexity, space_complexity


def analyze_code(code):
    results = {
        "ast_issues": [],
        "complexity_issues": [],
        "memory_warnings": [],
        "unused_warnings": [],
        "suggestions": [],
        "syntax_errors": [],
        "time_complexity": "",
        "space_complexity": ""
    }

    try:
        tree = ast.parse(code)
    except (SyntaxError, IndentationError) as e:
        results["syntax_errors"].append(f"{type(e).__name__}: {e.msg} on line {e.lineno}")
        return results

    # AST-based checks
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id.lower() in ["password", "secret", "token"]:
                    results["ast_issues"].append(
                        f"Possible hardcoded credential in variable '{target.id}' on line {node.lineno}"
                    )
        if isinstance(node, ast.For):
            for inner in ast.iter_child_nodes(node):
                if isinstance(inner, ast.For):
                    results["ast_issues"].append(f"Nested loop found on line {node.lineno}.")

    # Memory usage (heuristic)
    if "range(100000" in code or "list(range(10000" in code:
        results["memory_warnings"].append("Potential high memory usage with large list/range.")

    # Pylint unused variable warnings
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode='w') as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        completed = subprocess.run(
            ["pylint", tmp_path, "--disable=all", "--enable=unused-variable", "-rn", "--score=n", "--output-format=json"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        import json
        if completed.stdout:
            pylint_output = json.loads(completed.stdout)
            for item in pylint_output:
                if item.get("message-id", "").startswith("W0612"):
                    results["unused_warnings"].append(f"{item['message']} (line {item['line']})")
    except Exception as e:
        results["syntax_errors"].append(f"Pylint error: {str(e)}")
    finally:
        os.unlink(tmp_path)

    # Suggestions
    results["suggestions"].extend(
        [f"Suggestion: {msg}" for msg in results["ast_issues"] + results["memory_warnings"]]
    )

    # Complexity estimation
    results["time_complexity"], results["space_complexity"] = estimate_complexity(code)

    return results
