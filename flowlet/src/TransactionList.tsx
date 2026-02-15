import type {Transaction} from "./App.tsx";

interface Props {
    transactions: Transaction[];
    onDelete: (transactionId: string) => void;
}

function TransactionList({transactions, onDelete}: Props) {

    return (
        <ul>
            {transactions.map((transaction) => (
                <li key={transaction.transactionId}>
                    {transaction.transactionDate} | {transaction.amount} | {transaction.transactionType} | {transaction.memo}
                    <button onClick={() => onDelete(transaction.transactionId)}>
                        削除
                    </button>
                </li>
            ))}
        </ul>
    );

}

export default TransactionList;