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
      isidentityVerified: boolean;
      username: string;
    };
    highestBidder: null | {
      id: string;
      name: string;
      email: string;
      image: string;
      isidentityVerified: boolean;
      username: string;
    };
    winner: null | {
      id: string;
      name: string;
      email: string;
      image: string;
      isidentityVerified: boolean;
      username: string;
    };
    bids: Array<{
      id: string;
      amount: number;
      createdAt: string;
      user: {
        id: string;
        name: string;
        image: string;
        isidentityVerified: boolean;
        username: string;
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
