function calculateTag() {
	return Math.random() > 0.5;
  }
  
  // 入口函数
  function main() {
	const _a = 1000;
	const _b = 10;
	for (let b = 1; b < 10; b++) {
	  console.log(
		`a=${_a}\tb=${b}\tB=>A:${ba(initialA(_a), initialB(b))}\tA=>B:${ab(
		  initialA(_a),
		  initialB(b)
		)}`
	  );
	}
  
	for (let a = 1000; a < 10000; a += 1000) {
	  console.log(
		`a=${a}\tb=${_b}\tB=>A:${ba(initialA(a), initialB(_b))}\tA=>B:${ab(
		  initialA(a),
		  initialB(_b)
		)}`
	  );
	}
  }
  
  // 先遍历 B（小集合），后遍历 A（大集合）
  function ba(A, B) {
	let count = 0;
	B.forEach((element) => {
	  for (let i = 0; i < A.length; i++) {
		if (!A[i]?.link) {
		  A[i] = { link: calculateTag() };
		  count += 1;
		}
	  }
	});
	return count;
  }
  
  // 先遍历 A（大集合），后遍历 B（小集合）
  function ab(A, B) {
	let count = 0;
	for (let i = 0; i < A.length; i++) {
	  B.forEach((element) => {
		if (!A[i]?.link) {
		  A[i] = { link: calculateTag() };
		  count += 1;
		}
	  });
	}
	return count;
  }
  
  function initialA(capacity) {
	return new Array(capacity);
  }
  
  function initialB(capacity) {
	return new Array(capacity).fill(undefined);
  }
  
  main();
  