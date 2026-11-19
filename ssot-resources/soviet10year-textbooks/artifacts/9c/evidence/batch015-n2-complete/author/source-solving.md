# Independent source solving, before draft

Author: worker184-3. This is author reasoning, not independent semantic approval.
Written before constructing the draft or its options.

Source: the official current whitelist projection and prepared seed only.
Seed canonical SHA-256:
dfecb34ab756a04dd06cc3aeac792b5bc0a1b4ab4137b0a1539007aa45e67945
Book: 9c. Lesson: ana9-c1-s1-n2.
Exercises: 3, 4, 5, 6, 7, 8, 9.
Selected definition blocks: 17, 18, 19, 20. These state the induction principle
and its base/step requirements; no worked example was selected as a definition.
No answers, previous choice sets or historical mathematical examples were used.
No figures exist in the official inventory.

## Domain and ambiguity

The selected definition starts induction at 1 and advances k to k+1. The sum and
sequence tasks have a positive number of terms, so n and k are positive integers
in the candidate. This follows the supplied induction definition and does not
invent an empty-sum convention.

Exercise 5 excludes q=1, but does not exclude q=0. The source does not define
0^0. Thus evaluating its compact term formula literally at q=0,n=1 is
convention-dependent and cannot be silently declared valid. A recurrence-based
case analysis can retain every actual sequence value without that expression:
b_1 is the given initial term; if q=0 then b_n=0 for n>=2, and S_n=b_1 for n>=1.
For q!=0,1, the ordinary term and sum formulas are unambiguous. This is a visible
case treatment, not an amendment to the source or an assertion that 0^0=1.
The unresolved literal 0^0 interpretation is recorded as an unavailable task.

## Exercise 3: two finite-sum induction proofs

Let U_n=sum(j,j=1..n) and V_n=sum(j^2,j=1..n).
The learner must establish both identities for all positive n, not just verify
a numerical example.

U_1=1=1*2/2. Assuming U_k=k(k+1)/2,
U_(k+1)=k(k+1)/2+(k+1)=(k+1)(k+2)/2.
The base and arbitrary successor complete induction.

V_1=1=1*2*3/6. Assuming V_k=k(k+1)(2k+1)/6,
V_(k+1)=(k+1)[k(2k+1)+6(k+1)]/6
        =(k+1)(2k^2+7k+6)/6
        =(k+1)(k+2)(2k+3)/6.
The factorization is (k+2)(2k+3)=2k^2+7k+6.
The base and arbitrary successor complete induction.

These are independent identities sharing the same induction criterion. A native
multiple response can judge complete base/step arguments for each, rather than
ask for individual arithmetic cells. Recognition cannot demonstrate writing
either proof unaided.

## Exercise 4: arithmetic term and partial sum

The arithmetic recurrence is a_(k+1)=a_k+d; S_(k+1)=S_k+a_(k+1).
At n=1, the term is a_1 and the stated sum is a_1.
If a_k=a_1+(k-1)d then a_(k+1)=a_1+kd.
If S_k=k[2a_1+(k-1)d]/2 then
S_(k+1)={k[2a_1+(k-1)d]+2[a_1+kd]}/2
        ={2(k+1)a_1+[k(k-1)+2k]d}/2
        =(k+1)[2a_1+kd]/2.
This is the source expression at n=k+1. Both formulas advance together.
The conceptual distinction is term index versus number of differences, and
the sum's use of the new term rather than the previous terminal term.

## Exercise 5: geometric term, partial sum, and zero ratio

Use b_(k+1)=q*b_k and S_(k+1)=S_k+b_(k+1), with q!=1.
The initial values are b_1 and S_1=b_1.

For q!=0,1, b_1*q^0=b_1, and
b_1*(q^1-1)/(q-1)=b_1 establish the two base values.
Assuming the term result at k,
b_(k+1)=q*b_1*q^(k-1)=b_1*q^k.
Assuming the sum result at k,
S_(k+1)=b_1*(q^k-1)/(q-1)+b_1*q^k
        =b_1*[q^k-1+(q-1)q^k]/(q-1)
        =b_1*(q^(k+1)-1)/(q-1).
Only q-1 is cancelled; no division by b_1 or by a possibly zero term is used.

For q=0, the base values are still the given b_1 and S_1=b_1.
b_2=0*b_1=0. Thereafter 0 times any prior term is 0.
For every k>=1, b_(k+1)=0 and S_(k+1)=S_k+0=b_1.
This proves the entire zero-ratio sequence and its partial sums, including
the first step k=1, without using 0^0.

The candidate will judge complete induction transitions with both branches
visible in every alternative. The nonzero hypotheses and zero initial/partial
sequence facts are common stem conditions, not exclusive wording in the keyed
alternative. The original q!=1 restriction remains.

## Exercise 6: telescoping sum

For positive j,
1/[j(j+1)]=1/j-1/(j+1).
Adding j=1..n cancels 1/2 through 1/n, leaving
1-1/(n+1)=n/(n+1).
At n=1 this is 1/2. An independent induction verification is
k/(k+1)+1/[(k+1)(k+2)]
=[k(k+2)+1]/[(k+1)(k+2)]
=(k+1)/(k+2).
The written task requests the sum, not necessarily induction. A complete
telescoping argument retains the decomposition, endpoints and result.

## Exercise 7: two polynomial-summand induction proofs

Let T_n=sum(j(j+1),j=1..n) and R_n=sum(j(3j+1),j=1..n).

T_1=2=1*2*3/3. Assuming T_k=k(k+1)(k+2)/3,
T_(k+1)=k(k+1)(k+2)/3+(k+1)(k+2)
        =(k+1)(k+2)(k+3)/3.
The added summand must increment both factors.

R_1=4=1*2^2. Assuming R_k=k(k+1)^2,
R_(k+1)=k(k+1)^2+(k+1)[3(k+1)+1]
        =(k+1)[k(k+1)+3k+4]
        =(k+1)(k^2+4k+4)
        =(k+1)(k+2)^2.
The constant +1 inside 3j+1 must survive substitution j=k+1.
Each arbitrary successor and base establishes its respective identity.
These can be judged as full independent proof claims in a native multiple
response, with the same proof-production limitation as exercise 3.

## Exercise 8: divisibility of n^3+11n

Let x_n=n^3+11n. x_1=12 is divisible by 6.
x_(k+1)-x_k=3k^2+3k+12=3k(k+1)+12.
One of k,k+1 is even, so k(k+1)=2r for an integer r.
The increment is 6r+12=6(r+2).
Thus divisibility advances from k to k+1.

There is also a direct proof:
x_n=(n-1)n(n+1)+12n.
Among three consecutive integers at least one is even and at least one is a
multiple of 3. Hence their product is divisible by 6, as is 12n.
At n=1 the product is zero, still divisible by 6. This argument does not require
every factor to be even or every factor to be a multiple of 3.
The source says prove, so this complete direct proof also retains the task.

## Exercise 9: divisibility of 7^n-1

Let y_n=7^n-1. y_1=6.
Assuming y_k=6m for an integer m,
y_(k+1)=7*7^k-1
        =7(y_k+1)-1
        =7y_k+6
        =6(7m+1).
The affine correction +6 is essential; multiplying y_k alone also multiplies
its subtracted 1 and gives a different expression. The base plus arbitrary
successor proves the result for all positive n.

## Intended scope and losses

All seven selected written exercises and their mathematical sub-tasks are
represented. A choice response recognizes complete results/arguments but does
not prove unaided proof writing or unaided discovery of a decomposition.
The literal q=0,n=1 compact-power expression remains convention-dependent;
the actual zero-ratio sequence and sum are fully determined and retained.
Nothing here regenerates, evaluates or reapproves the approved prose, written
exercise files, or standard answers. No historical pass is adopted for a new
snapshot. Parent-provided independent semantic review is still required.
