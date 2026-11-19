## 1

Mode: multiple

For positive integers $n$, let $U_n=1+2+\cdots+n$ and $V_n=1^2+2^2+\cdots+n^2$. Consider the identities $U_n=\frac{n(n+1)}2$ and $V_n=\frac{n(n+1)(2n+1)}6$. Select every valid induction argument below. In each successor calculation, $k$ is an arbitrary positive integer and the corresponding identity at $k$ is assumed.

### A

$U_1=1=\frac{1\cdot2}{2}$, and $U_{k+1}=\frac{k(k+1)}2+(k+1)=\frac{(k+1)(k+2)}2$. These establish the identity for $U_n$.

### B

$V_1=1=\frac{1\cdot2\cdot3}{6}$, and $V_{k+1}=\frac{k(k+1)(2k+1)}6+(k+1)^2=\frac{(k+1)(k+2)(2k+1)}6$. These establish the identity for $V_n$.

### C

$U_1=1=\frac{1\cdot2}{2}$, and $U_{k+1}=\frac{k(k+1)}2+(k+1)=\frac{(k+1)^2}2$. These establish the identity for $U_n$.

### D

$V_1=1=\frac{1\cdot2\cdot3}{6}$, and $V_{k+1}=\frac{k(k+1)(2k+1)}6+(k+1)^2=\frac{(k+1)(k+2)(2k+3)}6$. These establish the identity for $V_n$.

## 2

Mode: single

An arithmetic sequence satisfies $a_{n+1}=a_n+d$, and $S_n=a_1+\cdots+a_n$. The base values are $a_1$ and $S_1=a_1$. Assume $a_k=a_1+(k-1)d$ and $S_k=\frac{k(2a_1+(k-1)d)}2$. Applying $a_{k+1}=a_k+d$ and $S_{k+1}=S_k+a_{k+1}$, which pair of results completes both induction steps for every real $a_1,d$ and positive integer $k$?

### A

$a_{k+1}=a_1+kd$, and $S_{k+1}=\frac{(k+1)(2a_1+(k+1)d)}2$.

### B

$a_{k+1}=a_1+(k-1)d$, and $S_{k+1}=\frac{(k+1)(2a_1+(k-1)d)}2$.

### C

$a_{k+1}=a_1+kd$, and $S_{k+1}=\frac{(k+1)(2a_1+kd)}2$.

### D

$a_{k+1}=a_1+kd$, and $S_{k+1}=(k+1)(2a_1+kd)$.

## 3

Mode: single

A sequence satisfies $b_{n+1}=q b_n$ for real $b_1,q$, where $q\ne1$; $q=0$ is included. Let $S_n=b_1+\cdots+b_n$. The base values are the given $b_1$ and $S_1=b_1$. For an arbitrary positive integer $k$, the induction hypotheses are: if $q\ne0$, then $b_k=b_1q^{k-1}$ and $S_k=\frac{b_1(q^k-1)}{q-1}$; if $q=0$, then $S_k=b_1$ and $b_j=0$ for $2\le j\le k$. Which complete case analysis follows from $b_{k+1}=q b_k$ and $S_{k+1}=S_k+b_{k+1}$ for every allowed $b_1,q,k$?

### A

| Case | $b_{k+1}$ | $S_{k+1}$ |
| --- | --- | --- |
| $q\ne0$ | $b_1q^{k+1}$ | $\frac{b_1(q^{k+2}-1)}{q-1}$ |
| $q=0$ | $0$ | $b_1$ |

### B

| Case | $b_{k+1}$ | $S_{k+1}$ |
| --- | --- | --- |
| $q\ne0$ | $b_1q^k$ | $\frac{b_1(q^{k+1}-1)}{q-1}$ |
| $q=0$ | $0$ | $b_1$ |

### C

| Case | $b_{k+1}$ | $S_{k+1}$ |
| --- | --- | --- |
| $q\ne0$ | $b_1q^{k+1}$ | $\frac{b_1q(q^{k+1}-1)}{q-1}$ |
| $q=0$ | $0$ | $0$ |

### D

| Case | $b_{k+1}$ | $S_{k+1}$ |
| --- | --- | --- |
| $q\ne0$ | $b_1+kq$ | $\frac{(k+1)(2b_1+kq)}2$ |
| $q=0$ | $b_1$ | $(k+1)b_1$ |

## 4

Mode: single

For a positive integer $n$, let $S_n=\frac1{1\cdot2}+\frac1{2\cdot3}+\cdots+\frac1{n(n+1)}$. Which calculation correctly gives the sum for every $n$?

### A

$\frac1{j(j+1)}=\frac1{j+1}-\frac1j$, so $S_n=\frac1{n+1}-1=-\frac n{n+1}$.

### B

$\frac1{j(j+1)}=\frac1j-\frac1{j+1}$, so $S_n=\frac1{n+1}$.

### C

$\frac1{j(j+1)}=\frac1j-\frac1{j+1}$, so $S_n=1-\frac1{n+1}=\frac n{n+1}$.

### D

$\frac1{j(j+1)}=\frac1j-\frac1{j+1}$, so $S_n=1-\frac1n=\frac{n-1}n$.

## 5

Mode: multiple

For positive integers $n$, let $T_n=\sum_{j=1}^n j(j+1)$ and $R_n=\sum_{j=1}^n j(3j+1)$. Consider $T_n=\frac{n(n+1)(n+2)}3$ and $R_n=n(n+1)^2$. Select every valid induction argument. Each successor calculation assumes the corresponding identity at an arbitrary positive integer $k$.

### A

$T_1=2=\frac{1\cdot2\cdot3}{3}$, and $T_{k+1}=\frac{k(k+1)(k+2)}3+(k+1)(k+2)=\frac{(k+1)^2(k+2)}3$. These establish the identity for $T_n$.

### B

$T_1=2=\frac{1\cdot2\cdot3}{3}$, and $T_{k+1}=\frac{k(k+1)(k+2)}3+(k+1)(k+2)=\frac{(k+1)(k+2)(k+3)}3$. These establish the identity for $T_n$.

### C

$R_1=4=1\cdot2^2$, and $R_{k+1}=k(k+1)^2+(k+1)(3k+3)=(k+1)^2(k+3)$. These establish the identity for $R_n$.

### D

$R_1=4=1\cdot2^2$, and $R_{k+1}=k(k+1)^2+(k+1)(3k+4)=(k+1)(k+2)^2$. These establish the identity for $R_n$.

## 6

Mode: single

Which argument validly proves that $n^3+11n$ is divisible by $6$ for every positive integer $n$?

### A

$n^3+11n=(n-1)n(n+1)+12n$. Among these three consecutive factors, at least one is even and at least one is divisible by $3$. Their product and $12n$ are therefore divisible by $6$.

### B

$n^3+11n=(n-1)n(n+1)+10n$. Among these three consecutive factors, at least one is even and at least one is divisible by $3$. Their product and the even term $10n$ are therefore divisible by $6$.

### C

$n^3+11n=(n-1)n(n+1)+12n$. Among these three consecutive factors, all three are even and at least one is divisible by $3$. Their product and $12n$ are therefore divisible by $6$.

### D

$n^3+11n=(n-1)n(n+1)+12n$. Among these three consecutive factors, at least one is even and all three are divisible by $3$. Their product and $12n$ are therefore divisible by $6$.

## 7

Mode: single

Let $y_n=7^n-1$ for positive integers $n$. The base case $y_1=6$ is checked. Suppose $y_k=6m$ for an integer $m$, where $k$ is an arbitrary positive integer. Which successor calculation completes a valid induction proof that every $y_n$ is divisible by $6$?

### A

$y_{k+1}=7y_k=6(7m)$, an integer multiple of $6$.

### B

$y_{k+1}=y_k+6=6(m+1)$, an integer multiple of $6$.

### C

$y_{k+1}=7y_k-6=6(7m-1)$, an integer multiple of $6$.

### D

$y_{k+1}=7y_k+6=6(7m+1)$, an integer multiple of $6$.
