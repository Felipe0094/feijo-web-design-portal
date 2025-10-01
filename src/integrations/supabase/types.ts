export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auto_insurance_quotes: {
        Row: {
          address: string | null
          armoring_value: number | null
          birth_date: string | null
          chassis_number: string | null
          city: string | null
          complement: string | null
          condutor_menor: string | null
          covers_young_drivers: boolean | null
          created_at: string | null
          document_number: string
          driver_birth_date: string | null
          driver_document_number: string | null
          driver_full_name: string | null
          driver_gender: Database["public"]["Enums"]["gender"] | null
          driver_income: number | null
          driver_license_category: string | null
          driver_license_expiration: string | null
          driver_license_number: string | null
          driver_marital_status:
            | Database["public"]["Enums"]["marital_status"]
            | null
          driver_profession: string | null
          driver_relationship: string | null
          driver_residence_type:
            | Database["public"]["Enums"]["residence_type"]
            | null
          email: string
          fuel_type: string | null
          full_name: string
          gas_kit_value: number | null
          gender: Database["public"]["Enums"]["gender"] | null
          has_automatic_gate: boolean | null
          has_home_garage: boolean | null
          has_natural_gas: boolean | null
          has_school_garage: Database["public"]["Enums"]["garage_status"] | null
          has_sunroof: boolean | null
          has_work_garage: Database["public"]["Enums"]["garage_status"] | null
          id: string
          insurance_type: Database["public"]["Enums"]["insurance_type"] | null
          is_armored: boolean | null
          is_driver_insured: boolean | null
          is_financed: boolean | null
          is_new_vehicle: boolean | null
          license_plate: string | null
          manufacture_year: number | null
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          model: string | null
          model_year: number | null
          neighborhood: string | null
          number: string | null
          parking_zip_code: string | null
          phone: string
          policy_file_path: string | null
          residence_type: Database["public"]["Enums"]["residence_type"] | null
          seller: string
          state: string | null
          street: string | null
          vehicle_usage: Database["public"]["Enums"]["vehicle_usage"] | null
          vehicles_at_residence: number | null
          youngest_driver_age: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          armoring_value?: number | null
          birth_date?: string | null
          chassis_number?: string | null
          city?: string | null
          complement?: string | null
          condutor_menor?: string | null
          covers_young_drivers?: boolean | null
          created_at?: string | null
          document_number: string
          driver_birth_date?: string | null
          driver_document_number?: string | null
          driver_full_name?: string | null
          driver_gender?: Database["public"]["Enums"]["gender"] | null
          driver_income?: number | null
          driver_license_category?: string | null
          driver_license_expiration?: string | null
          driver_license_number?: string | null
          driver_marital_status?:
            | Database["public"]["Enums"]["marital_status"]
            | null
          driver_profession?: string | null
          driver_relationship?: string | null
          driver_residence_type?:
            | Database["public"]["Enums"]["residence_type"]
            | null
          email: string
          fuel_type?: string | null
          full_name: string
          gas_kit_value?: number | null
          gender?: Database["public"]["Enums"]["gender"] | null
          has_automatic_gate?: boolean | null
          has_home_garage?: boolean | null
          has_natural_gas?: boolean | null
          has_school_garage?:
            | Database["public"]["Enums"]["garage_status"]
            | null
          has_sunroof?: boolean | null
          has_work_garage?: Database["public"]["Enums"]["garage_status"] | null
          id?: string
          insurance_type?: Database["public"]["Enums"]["insurance_type"] | null
          is_armored?: boolean | null
          is_driver_insured?: boolean | null
          is_financed?: boolean | null
          is_new_vehicle?: boolean | null
          license_plate?: string | null
          manufacture_year?: number | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          model?: string | null
          model_year?: number | null
          neighborhood?: string | null
          number?: string | null
          parking_zip_code?: string | null
          phone: string
          policy_file_path?: string | null
          residence_type?: Database["public"]["Enums"]["residence_type"] | null
          seller?: string
          state?: string | null
          street?: string | null
          vehicle_usage?: Database["public"]["Enums"]["vehicle_usage"] | null
          vehicles_at_residence?: number | null
          youngest_driver_age?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          armoring_value?: number | null
          birth_date?: string | null
          chassis_number?: string | null
          city?: string | null
          complement?: string | null
          condutor_menor?: string | null
          covers_young_drivers?: boolean | null
          created_at?: string | null
          document_number?: string
          driver_birth_date?: string | null
          driver_document_number?: string | null
          driver_full_name?: string | null
          driver_gender?: Database["public"]["Enums"]["gender"] | null
          driver_income?: number | null
          driver_license_category?: string | null
          driver_license_expiration?: string | null
          driver_license_number?: string | null
          driver_marital_status?:
            | Database["public"]["Enums"]["marital_status"]
            | null
          driver_profession?: string | null
          driver_relationship?: string | null
          driver_residence_type?:
            | Database["public"]["Enums"]["residence_type"]
            | null
          email?: string
          fuel_type?: string | null
          full_name?: string
          gas_kit_value?: number | null
          gender?: Database["public"]["Enums"]["gender"] | null
          has_automatic_gate?: boolean | null
          has_home_garage?: boolean | null
          has_natural_gas?: boolean | null
          has_school_garage?:
            | Database["public"]["Enums"]["garage_status"]
            | null
          has_sunroof?: boolean | null
          has_work_garage?: Database["public"]["Enums"]["garage_status"] | null
          id?: string
          insurance_type?: Database["public"]["Enums"]["insurance_type"] | null
          is_armored?: boolean | null
          is_driver_insured?: boolean | null
          is_financed?: boolean | null
          is_new_vehicle?: boolean | null
          license_plate?: string | null
          manufacture_year?: number | null
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          model?: string | null
          model_year?: number | null
          neighborhood?: string | null
          number?: string | null
          parking_zip_code?: string | null
          phone?: string
          policy_file_path?: string | null
          residence_type?: Database["public"]["Enums"]["residence_type"] | null
          seller?: string
          state?: string | null
          street?: string | null
          vehicle_usage?: Database["public"]["Enums"]["vehicle_usage"] | null
          vehicles_at_residence?: number | null
          youngest_driver_age?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      bond_insurance_quotes: {
        Row: {
          cnpj: string
          created_at: string
          edital_file_path: string | null
          email: string
          full_name: string
          id: string
          other_documents_file_path: string | null
          phone: string
          seller: string
          status: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          edital_file_path?: string | null
          email: string
          full_name: string
          id?: string
          other_documents_file_path?: string | null
          phone: string
          seller?: string
          status?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          edital_file_path?: string | null
          email?: string
          full_name?: string
          id?: string
          other_documents_file_path?: string | null
          phone?: string
          seller?: string
          status?: string
        }
        Relationships: []
      }
      business_insurance_quotes: {
        Row: {
          additional_info: Json | null
          city: string
          cnpj: string
          company_name: string
          complement: string | null
          construction_type: string
          coverage_options: Json
          created_at: string
          document_number: string
          email: string
          fire_equipment: Json | null
          full_name: string
          id: string
          insurance_type: string
          main_activity: string
          neighborhood: string
          number: string
          phone: string
          policy_file_path: string | null
          security_equipment: Json | null
          seller: string | null
          state: string
          status: string | null
          street: string
          zip_code: string
        }
        Insert: {
          additional_info?: Json | null
          city: string
          cnpj: string
          company_name: string
          complement?: string | null
          construction_type: string
          coverage_options: Json
          created_at?: string
          document_number: string
          email: string
          fire_equipment?: Json | null
          full_name: string
          id?: string
          insurance_type: string
          main_activity: string
          neighborhood: string
          number: string
          phone: string
          policy_file_path?: string | null
          security_equipment?: Json | null
          seller?: string | null
          state: string
          status?: string | null
          street: string
          zip_code: string
        }
        Update: {
          additional_info?: Json | null
          city?: string
          cnpj?: string
          company_name?: string
          complement?: string | null
          construction_type?: string
          coverage_options?: Json
          created_at?: string
          document_number?: string
          email?: string
          fire_equipment?: Json | null
          full_name?: string
          id?: string
          insurance_type?: string
          main_activity?: string
          neighborhood?: string
          number?: string
          phone?: string
          policy_file_path?: string | null
          security_equipment?: Json | null
          seller?: string | null
          state?: string
          status?: string | null
          street?: string
          zip_code?: string
        }
        Relationships: []
      }
      civil_works_insurance_quotes: {
        Row: {
          basement_count: number
          city: string
          complement: string | null
          construction_type: string
          contractors_count: number
          coverage_options: Json
          created_at: string
          demolition_type: string
          document_number: string
          email: string
          end_date: string
          full_name: string
          has_adjacent_buildings: boolean
          has_excavation: boolean
          has_grounding_service: boolean
          has_previous_claims: boolean
          has_previous_insurance: boolean
          has_structural_reinforcement: boolean
          has_terrain_containment: boolean
          has_tie_rods: boolean
          has_water_table_lowering: boolean
          id: string
          neighborhood: string
          number: string
          phone: string
          policy_file_path: string | null
          seller: string
          service_type: string
          services_description: string
          start_date: string
          state: string
          status: string
          street: string
          structure_types: Json
          upper_floors_count: number
          zip_code: string
        }
        Insert: {
          basement_count: number
          city: string
          complement?: string | null
          construction_type: string
          contractors_count: number
          coverage_options: Json
          created_at?: string
          demolition_type: string
          document_number: string
          email: string
          end_date: string
          full_name: string
          has_adjacent_buildings: boolean
          has_excavation: boolean
          has_grounding_service: boolean
          has_previous_claims: boolean
          has_previous_insurance: boolean
          has_structural_reinforcement: boolean
          has_terrain_containment: boolean
          has_tie_rods: boolean
          has_water_table_lowering: boolean
          id?: string
          neighborhood: string
          number: string
          phone: string
          policy_file_path?: string | null
          seller?: string
          service_type: string
          services_description: string
          start_date: string
          state: string
          status?: string
          street: string
          structure_types: Json
          upper_floors_count: number
          zip_code: string
        }
        Update: {
          basement_count?: number
          city?: string
          complement?: string | null
          construction_type?: string
          contractors_count?: number
          coverage_options?: Json
          created_at?: string
          demolition_type?: string
          document_number?: string
          email?: string
          end_date?: string
          full_name?: string
          has_adjacent_buildings?: boolean
          has_excavation?: boolean
          has_grounding_service?: boolean
          has_previous_claims?: boolean
          has_previous_insurance?: boolean
          has_structural_reinforcement?: boolean
          has_terrain_containment?: boolean
          has_tie_rods?: boolean
          has_water_table_lowering?: boolean
          id?: string
          neighborhood?: string
          number?: string
          phone?: string
          policy_file_path?: string | null
          seller?: string
          service_type?: string
          services_description?: string
          start_date?: string
          state?: string
          status?: string
          street?: string
          structure_types?: Json
          upper_floors_count?: number
          zip_code?: string
        }
        Relationships: []
      }
      health_insurance_dependents: {
        Row: {
          age: number | null
          birth_date: string
          cpf: string
          id: string
          name: string
          quote_id: string
        }
        Insert: {
          age?: number | null
          birth_date: string
          cpf: string
          id?: string
          name: string
          quote_id: string
        }
        Update: {
          age?: number | null
          birth_date?: string
          cpf?: string
          id?: string
          name?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_insurance_dependents_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "health_insurance_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      health_insurance_quotes: {
        Row: {
          created_at: string
          current_plan_file_path: string | null
          document_number: string
          email: string
          has_copayment: boolean
          id: string
          insured_age: number | null
          insured_birth_date: string
          insured_cpf: string
          insured_name: string
          municipality: string
          notes: string | null
          phone: string
          responsible_name: string
          room_type: string
          seller: string
          status: string | null
        }
        Insert: {
          created_at?: string
          current_plan_file_path?: string | null
          document_number: string
          email: string
          has_copayment?: boolean
          id?: string
          insured_age?: number | null
          insured_birth_date: string
          insured_cpf: string
          insured_name: string
          municipality: string
          notes?: string | null
          phone: string
          responsible_name: string
          room_type: string
          seller?: string
          status?: string | null
        }
        Update: {
          created_at?: string
          current_plan_file_path?: string | null
          document_number?: string
          email?: string
          has_copayment?: boolean
          id?: string
          insured_age?: number | null
          insured_birth_date?: string
          insured_cpf?: string
          insured_name?: string
          municipality?: string
          notes?: string | null
          phone?: string
          responsible_name?: string
          room_type?: string
          seller?: string
          status?: string | null
        }
        Relationships: []
      }
      home_insurance_quotes: {
        Row: {
          additional_data: Json | null
          birth_date: string | null
          city: string
          complement: string | null
          construction_type: string
          created_at: string
          document_number: string
          electrical_damage_value: number | null
          email: string
          flooding_value: number | null
          full_name: string
          glass_value: number | null
          id: string
          insurance_type: string
          insured_value: number | null
          neighborhood: string
          number: string
          occupation_type: string
          other_coverage_notes: string | null
          phone: string
          pipe_leakage_value: number | null
          policy_file_path: string | null
          residence_type: string
          security_equipment: Json | null
          seller: string
          state: string
          street: string
          theft_value: number | null
          zip_code: string
        }
        Insert: {
          additional_data?: Json | null
          birth_date?: string | null
          city: string
          complement?: string | null
          construction_type: string
          created_at?: string
          document_number: string
          electrical_damage_value?: number | null
          email: string
          flooding_value?: number | null
          full_name: string
          glass_value?: number | null
          id?: string
          insurance_type: string
          insured_value?: number | null
          neighborhood: string
          number: string
          occupation_type: string
          other_coverage_notes?: string | null
          phone: string
          pipe_leakage_value?: number | null
          policy_file_path?: string | null
          residence_type: string
          security_equipment?: Json | null
          seller?: string
          state: string
          street: string
          theft_value?: number | null
          zip_code: string
        }
        Update: {
          additional_data?: Json | null
          birth_date?: string | null
          city?: string
          complement?: string | null
          construction_type?: string
          created_at?: string
          document_number?: string
          electrical_damage_value?: number | null
          email?: string
          flooding_value?: number | null
          full_name?: string
          glass_value?: number | null
          id?: string
          insurance_type?: string
          insured_value?: number | null
          neighborhood?: string
          number?: string
          occupation_type?: string
          other_coverage_notes?: string | null
          phone?: string
          pipe_leakage_value?: number | null
          policy_file_path?: string | null
          residence_type?: string
          security_equipment?: Json | null
          seller?: string
          state?: string
          street?: string
          theft_value?: number | null
          zip_code?: string
        }
        Relationships: []
      }
      life_insurance_quotes: {
        Row: {
          accidental_death_coverage: number | null
          birth_date: string | null
          created_at: string
          document_number: string
          email: string
          full_name: string
          height: number | null
          id: string
          insurance_type: string
          monthly_income: number | null
          permanent_disability_coverage: number | null
          phone: string
          policy_file_path: string | null
          practices_sports: boolean
          retirement_status: string
          seller: string
          smoker: boolean
          sports_description: string | null
          standard_death_coverage: number | null
          weight: number | null
        }
        Insert: {
          accidental_death_coverage?: number | null
          birth_date?: string | null
          created_at?: string
          document_number: string
          email: string
          full_name: string
          height?: number | null
          id?: string
          insurance_type: string
          monthly_income?: number | null
          permanent_disability_coverage?: number | null
          phone: string
          policy_file_path?: string | null
          practices_sports?: boolean
          retirement_status?: string
          seller?: string
          smoker?: boolean
          sports_description?: string | null
          standard_death_coverage?: number | null
          weight?: number | null
        }
        Update: {
          accidental_death_coverage?: number | null
          birth_date?: string | null
          created_at?: string
          document_number?: string
          email?: string
          full_name?: string
          height?: number | null
          id?: string
          insurance_type?: string
          monthly_income?: number | null
          permanent_disability_coverage?: number | null
          phone?: string
          policy_file_path?: string | null
          practices_sports?: boolean
          retirement_status?: string
          seller?: string
          smoker?: boolean
          sports_description?: string | null
          standard_death_coverage?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      travel_insurance_quotes: {
        Row: {
          cpf: string
          created_at: string
          departure_date: string
          destination: string
          email: string
          full_name: string
          id: string
          motorcycle_use: boolean
          passengers_0_to_64: number
          passengers_65_to_70: number
          passengers_71_to_85: number
          phone: string
          purpose: string
          return_date: string
          seller: string
          status: string
          trip_type: string
        }
        Insert: {
          cpf: string
          created_at?: string
          departure_date: string
          destination: string
          email: string
          full_name: string
          id?: string
          motorcycle_use: boolean
          passengers_0_to_64: number
          passengers_65_to_70: number
          passengers_71_to_85: number
          phone: string
          purpose: string
          return_date: string
          seller: string
          status?: string
          trip_type: string
        }
        Update: {
          cpf?: string
          created_at?: string
          departure_date?: string
          destination?: string
          email?: string
          full_name?: string
          id?: string
          motorcycle_use?: boolean
          passengers_0_to_64?: number
          passengers_65_to_70?: number
          passengers_71_to_85?: number
          phone?: string
          purpose?: string
          return_date?: string
          seller?: string
          status?: string
          trip_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      garage_status: "true" | "false" | "not_applicable"
      gender: "male" | "female" | "other"
      insurance_type: "new" | "renewal"
      marital_status: "single" | "married" | "divorced" | "widowed" | "other"
      residence_type: "house" | "apartment" | "condominium"
      vehicle_usage: "personal" | "work" | "passenger_transport"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      garage_status: ["true", "false", "not_applicable"],
      gender: ["male", "female", "other"],
      insurance_type: ["new", "renewal"],
      marital_status: ["single", "married", "divorced", "widowed", "other"],
      residence_type: ["house", "apartment", "condominium"],
      vehicle_usage: ["personal", "work", "passenger_transport"],
    },
  },
} as const
