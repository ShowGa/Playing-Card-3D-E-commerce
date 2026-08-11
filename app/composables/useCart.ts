type CartItem = {
    product: StripeProduct;
    quantity: number;
    name: string;
};

type CartItems = Record<string, CartItem>;

type UseCartReturnType = {
    items: Readonly<Ref<CartItems>>; // useLocalStorage return a Ref<>

    totalPrice: ComputedRef<number>;
    totalItem: ComputedRef<number>;

    upsertItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clear: () => void;
};

const LOCAL_STORAGE_KEY = "showga-cart";

export const useCart = () => {
    const items = useLocalStorage<CartItems>(LOCAL_STORAGE_KEY, () => ({}));

    const totalPrice = computed(() => {
        return Object.values(items.value).reduce(
            (acc, item) => acc + item.quantity * item.product.price.amount,
            0,
        );
    });

    const totalItem = computed(() => {
        return Object.values(items.value).reduce(
            (acc, item) => acc + item.quantity,
            0,
        );
    });

    const upsertItem = (item: CartItem) => {
        if (item.quantity <= 0) {
            removeItem(item.product.id);
            return;
        }

        items.value[item.product.id] = item;
    };

    const removeItem = (id: string) => {
        delete items.value[id];
    };

    const clear = () => {
        items.value = {};
    };

    return {
        // State => read only
        items,

        // Computed
        totalPrice,
        totalItem,

        // Actions
        upsertItem,
        removeItem,
        clear,
    };
};
