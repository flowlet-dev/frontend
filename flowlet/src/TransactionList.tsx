import type {Transaction} from "./App.tsx";

interface Props {
    transactions: Transaction[];
}

function TransactionList({transactions}: Props) {

    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.transactionId}>
                    {transaction.transactionDate} | {transaction.amount} | {transaction.transactionType} | {transaction.memo}
                </li>
            ))}
        </ul>
    );

}

export default TransactionList;