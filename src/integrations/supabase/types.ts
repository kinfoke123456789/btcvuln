export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          context: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: string | null
          recommendation: string
          recommendation_type: string
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          recommendation: string
          recommendation_type: string
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          recommendation?: string
          recommendation_type?: string
        }
        Relationships: []
      }
      arbitrage_contracts: {
        Row: {
          chain_id: number
          contract_address: string
          contract_type: string
          created_at: string | null
          deployed_at: string | null
          deployment_hash: string | null
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          chain_id?: number
          contract_address: string
          contract_type?: string
          created_at?: string | null
          deployed_at?: string | null
          deployment_hash?: string | null
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          chain_id?: number
          contract_address?: string
          contract_type?: string
          created_at?: string | null
          deployed_at?: string | null
          deployment_hash?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      arbitrage_opportunities: {
        Row: {
          complexity: string
          created_at: string
          estimated_profit: number
          from_exchange: string
          id: string
          is_active: boolean
          profit_percentage: number
          requires_flash_loan: boolean
          time_available: string
          to_exchange: string
          token_pair: string
          updated_at: string
          user_id: string
        }
        Insert: {
          complexity: string
          created_at?: string
          estimated_profit: number
          from_exchange: string
          id?: string
          is_active?: boolean
          profit_percentage: number
          requires_flash_loan?: boolean
          time_available: string
          to_exchange: string
          token_pair: string
          updated_at?: string
          user_id: string
        }
        Update: {
          complexity?: string
          created_at?: string
          estimated_profit?: number
          from_exchange?: string
          id?: string
          is_active?: boolean
          profit_percentage?: number
          requires_flash_loan?: boolean
          time_available?: string
          to_exchange?: string
          token_pair?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      arbitrage_trades: {
        Row: {
          amount_in: number
          amount_out: number | null
          contract_address: string | null
          created_at: string | null
          dex_a: string
          dex_b: string
          execution_time: string | null
          gas_price: number | null
          gas_used: number | null
          id: string
          opportunity_id: string
          profit_usd: number | null
          status: string | null
          token_pair: string
          transaction_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_in: number
          amount_out?: number | null
          contract_address?: string | null
          created_at?: string | null
          dex_a: string
          dex_b: string
          execution_time?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          opportunity_id: string
          profit_usd?: number | null
          status?: string | null
          token_pair: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_in?: number
          amount_out?: number | null
          contract_address?: string | null
          created_at?: string | null
          dex_a?: string
          dex_b?: string
          execution_time?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          opportunity_id?: string
          profit_usd?: number | null
          status?: string | null
          token_pair?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      component_templates: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          preview_image: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          preview_image?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          preview_image?: string | null
        }
        Relationships: []
      }
      customer_analytics: {
        Row: {
          created_at: string | null
          customer_count: number | null
          duration_minutes: number | null
          id: string
          order_id: string | null
          order_total: number | null
          server_id: string | null
          table_id: string | null
          tip_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          customer_count?: number | null
          duration_minutes?: number | null
          id?: string
          order_id?: string | null
          order_total?: number | null
          server_id?: string | null
          table_id?: string | null
          tip_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          customer_count?: number | null
          duration_minutes?: number | null
          id?: string
          order_id?: string | null
          order_total?: number | null
          server_id?: string | null
          table_id?: string | null
          tip_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_analytics_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_analytics_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_analytics_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          code: string
          created_at: string | null
          format: Database["public"]["Enums"]["export_format"]
          id: string
          user_id: string | null
          website_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          format: Database["public"]["Enums"]["export_format"]
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          format?: Database["public"]["Enums"]["export_format"]
          id?: string
          user_id?: string | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_loan_transactions: {
        Row: {
          amount: number
          blockchain_network: string
          completed_at: string | null
          created_at: string
          fee: number
          id: string
          profit: number | null
          status: string
          token_address: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          blockchain_network: string
          completed_at?: string | null
          created_at?: string
          fee: number
          id?: string
          profit?: number | null
          status?: string
          token_address: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          blockchain_network?: string
          completed_at?: string | null
          created_at?: string
          fee?: number
          id?: string
          profit?: number | null
          status?: string
          token_address?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gas_sponsorships: {
        Row: {
          created_at: string
          id: string
          paymaster_policy_id: string | null
          sponsor_address: string
          sponsored_amount: string
          user_id: string
          user_operation_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paymaster_policy_id?: string | null
          sponsor_address: string
          sponsored_amount: string
          user_id: string
          user_operation_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paymaster_policy_id?: string | null
          sponsor_address?: string
          sponsored_amount?: string
          user_id?: string
          user_operation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gas_sponsorships_paymaster_policy_id_fkey"
            columns: ["paymaster_policy_id"]
            isOneToOne: false
            referencedRelation: "paymaster_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gas_sponsorships_user_operation_id_fkey"
            columns: ["user_operation_id"]
            isOneToOne: false
            referencedRelation: "user_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          category_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          prep_time: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          prep_time?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          prep_time?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string | null
          order_id: string | null
          quantity: number
          special_instructions: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_count: number | null
          id: string
          notes: string | null
          server_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          table_id: string | null
          tax_amount: number | null
          tip_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_count?: number | null
          id?: string
          notes?: string | null
          server_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_count?: number | null
          id?: string
          notes?: string | null
          server_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          tip_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      paymaster_policies: {
        Row: {
          allowed_contracts: Json | null
          allowed_functions: Json | null
          created_at: string
          daily_limit: string
          description: string | null
          id: string
          is_active: boolean
          max_fee_per_gas: string
          max_gas_limit: string
          monthly_limit: string
          name: string
          updated_at: string
        }
        Insert: {
          allowed_contracts?: Json | null
          allowed_functions?: Json | null
          created_at?: string
          daily_limit: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_fee_per_gas: string
          max_gas_limit: string
          monthly_limit: string
          name: string
          updated_at?: string
        }
        Update: {
          allowed_contracts?: Json | null
          allowed_functions?: Json | null
          created_at?: string
          daily_limit?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_fee_per_gas?: string
          max_gas_limit?: string
          monthly_limit?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      price_monitoring: {
        Row: {
          exchange: string
          id: string
          price: number
          timestamp: string
          token_pair: string
          volume_24h: number | null
        }
        Insert: {
          exchange: string
          id?: string
          price: number
          timestamp?: string
          token_pair: string
          volume_24h?: number | null
        }
        Update: {
          exchange?: string
          id?: string
          price?: number
          timestamp?: string
          token_pair?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          created_at: string | null
          id: string
          seats: number
          section: string
          server_id: string | null
          status: Database["public"]["Enums"]["table_status"] | null
          table_number: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          seats: number
          section: string
          server_id?: string | null
          status?: Database["public"]["Enums"]["table_status"] | null
          table_number: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          seats?: number
          section?: string
          server_id?: string | null
          status?: Database["public"]["Enums"]["table_status"] | null
          table_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_accounts: {
        Row: {
          account_address: string
          chain_id: number
          created_at: string
          factory_address: string
          id: string
          is_deployed: boolean
          salt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_address: string
          chain_id: number
          created_at?: string
          factory_address: string
          id?: string
          is_deployed?: boolean
          salt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_address?: string
          chain_id?: number
          created_at?: string
          factory_address?: string
          id?: string
          is_deployed?: boolean
          salt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          plan_name: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan_name?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan_name?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          ai_requests: number | null
          components_generated: number | null
          created_at: string | null
          exports_count: number | null
          id: string
          month_year: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_requests?: number | null
          components_generated?: number | null
          created_at?: string | null
          exports_count?: number | null
          id?: string
          month_year: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_requests?: number | null
          components_generated?: number | null
          created_at?: string | null
          exports_count?: number | null
          id?: string
          month_year?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_operations: {
        Row: {
          actual_gas_cost: string | null
          block_number: number | null
          call_data: string
          call_gas_limit: string
          created_at: string
          gas_used: string | null
          id: string
          max_fee_per_gas: string
          max_priority_fee_per_gas: string
          nonce: string
          paymaster_and_data: string | null
          pre_verification_gas: string
          sender: string
          signature: string
          smart_account_id: string
          status: string
          transaction_hash: string | null
          updated_at: string
          user_id: string
          user_op_hash: string
          verification_gas_limit: string
        }
        Insert: {
          actual_gas_cost?: string | null
          block_number?: number | null
          call_data: string
          call_gas_limit: string
          created_at?: string
          gas_used?: string | null
          id?: string
          max_fee_per_gas: string
          max_priority_fee_per_gas: string
          nonce: string
          paymaster_and_data?: string | null
          pre_verification_gas: string
          sender: string
          signature: string
          smart_account_id: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
          user_op_hash: string
          verification_gas_limit: string
        }
        Update: {
          actual_gas_cost?: string | null
          block_number?: number | null
          call_data?: string
          call_gas_limit?: string
          created_at?: string
          gas_used?: string | null
          id?: string
          max_fee_per_gas?: string
          max_priority_fee_per_gas?: string
          nonce?: string
          paymaster_and_data?: string | null
          pre_verification_gas?: string
          sender?: string
          signature?: string
          smart_account_id?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
          user_op_hash?: string
          verification_gas_limit?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_operations_smart_account_id_fkey"
            columns: ["smart_account_id"]
            isOneToOne: false
            referencedRelation: "smart_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trading_preferences: {
        Row: {
          auto_trading_enabled: boolean
          created_at: string
          id: string
          max_risk_percentage: number
          max_trade_amount: number
          min_profit_threshold: number
          preferred_chains: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_trading_enabled?: boolean
          created_at?: string
          id?: string
          max_risk_percentage?: number
          max_trade_amount?: number
          min_profit_threshold?: number
          preferred_chains?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_trading_enabled?: boolean
          created_at?: string
          id?: string
          max_risk_percentage?: number
          max_trade_amount?: number
          min_profit_threshold?: number
          preferred_chains?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          components: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          settings: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          components?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          settings?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          components?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          settings?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "websites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      export_format: "jsx" | "html" | "tailwind"
      order_status:
        | "pending"
        | "preparing"
        | "ready"
        | "served"
        | "paid"
        | "cancelled"
      payment_method: "cash" | "card" | "mobile"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_status: "active" | "canceled" | "past_due" | "incomplete"
      table_status: "available" | "occupied" | "reserved" | "cleaning"
      user_role: "free" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      export_format: ["jsx", "html", "tailwind"],
      order_status: [
        "pending",
        "preparing",
        "ready",
        "served",
        "paid",
        "cancelled",
      ],
      payment_method: ["cash", "card", "mobile"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_status: ["active", "canceled", "past_due", "incomplete"],
      table_status: ["available", "occupied", "reserved", "cleaning"],
      user_role: ["free", "pro", "enterprise"],
    },
  },
} as const
