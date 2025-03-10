export interface AuctionResponse {
  success: true;
  auction: {
    id: string;
    postId: string;
    sellerId: string;
    startingPrice: number;
    highestBid: number;
    highestBidderId: string | null;
    winnerId: string | null;
    status: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    seller: {
      id: string;
      name: string;
      email: string;
<<<<<<< HEAD
      isidentityVerified: boolean;
      username: string;
=======
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
    };
    highestBidder: null | {
      id: string;
      name: string;
      email: string;
      image: string;
<<<<<<< HEAD
      isidentityVerified: boolean;
      username: string;
=======
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
    };
    winner: null | {
      id: string;
      name: string;
      email: string;
      image: string;
<<<<<<< HEAD
      isidentityVerified: boolean;
      username: string;
=======
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
    };
    bids: Array<{
      id: string;
      amount: number;
      createdAt: string;
      user: {
        id: string;
        name: string;
        image: string;
<<<<<<< HEAD
        isidentityVerified: boolean;
        username: string;
=======
>>>>>>> f690ea8 (Add Auction Bar with Bid Placement)
      };
    }>;
    post: {
      id: string;
      title: string;
      description: string;
      imageURL: string;
    };
  };
}
