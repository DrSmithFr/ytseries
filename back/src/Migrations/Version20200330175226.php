<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200330175226 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE series_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE series_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE categories_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE seasons_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE episodes_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE historic_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE refresh_tokens_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE app_user (id INT NOT NULL, uuid UUID NOT NULL, username VARCHAR(255) NOT NULL, validation_token UUID DEFAULT NULL, validated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, password VARCHAR(255) NOT NULL, salt VARCHAR(255) DEFAULT NULL, roles JSON NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_88BDF3E9D17F50A6 ON app_user (uuid)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_88BDF3E9F85E0677 ON app_user (username)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_88BDF3E9B724A428 ON app_user (validation_token) WHERE validation_token IS NOT NULL');
        $this->addSql('COMMENT ON COLUMN app_user.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN app_user.validation_token IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN app_user.roles IS \'(DC2Type:json_array)\'');
        $this->addSql('CREATE TABLE app_series_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, import_code VARCHAR(255) DEFAULT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE app_series (id INT NOT NULL, series_type_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, locale VARCHAR(255) NOT NULL, image VARCHAR(255) DEFAULT NULL, description VARCHAR(255) NOT NULL, import_code VARCHAR(255) DEFAULT NULL, tags TEXT DEFAULT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_DF136CAD9D47B361 ON app_series (series_type_id)');
        $this->addSql('COMMENT ON COLUMN app_series.tags IS \'(DC2Type:simple_array)\'');
        $this->addSql('CREATE TABLE app_mtm_series_to_categories (series_id INT NOT NULL, category_id INT NOT NULL, PRIMARY KEY(series_id, category_id))');
        $this->addSql('CREATE INDEX IDX_1B976C15278319C ON app_mtm_series_to_categories (series_id)');
        $this->addSql('CREATE INDEX IDX_1B976C112469DE2 ON app_mtm_series_to_categories (category_id)');
        $this->addSql('CREATE TABLE app_categories (id INT NOT NULL, slug VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6CE8ED14989D9B62 ON app_categories (slug)');
        $this->addSql('CREATE TABLE app_seasons (id INT NOT NULL, series_id INT DEFAULT NULL, rank INT NOT NULL, name VARCHAR(255) NOT NULL, import_code VARCHAR(255) DEFAULT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_59A9B0515278319C ON app_seasons (series_id)');
        $this->addSql('CREATE TABLE app_episodes (id INT NOT NULL, season_id INT DEFAULT NULL, code VARCHAR(255) NOT NULL, rank INT NOT NULL, name VARCHAR(255) NOT NULL, duration INT DEFAULT NULL, import_code VARCHAR(255) DEFAULT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_75553E704EC001D1 ON app_episodes (season_id)');
        $this->addSql('CREATE TABLE app_historic (id INT NOT NULL, user_id INT DEFAULT NULL, series_id INT DEFAULT NULL, episode_id INT DEFAULT NULL, time_code INT DEFAULT 0 NOT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A5D28FFBA76ED395 ON app_historic (user_id)');
        $this->addSql('CREATE INDEX IDX_A5D28FFB5278319C ON app_historic (series_id)');
        $this->addSql('CREATE INDEX IDX_A5D28FFB362B62A0 ON app_historic (episode_id)');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('ALTER TABLE app_series ADD CONSTRAINT FK_DF136CAD9D47B361 FOREIGN KEY (series_type_id) REFERENCES app_series_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_mtm_series_to_categories ADD CONSTRAINT FK_1B976C15278319C FOREIGN KEY (series_id) REFERENCES app_series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_mtm_series_to_categories ADD CONSTRAINT FK_1B976C112469DE2 FOREIGN KEY (category_id) REFERENCES app_categories (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_seasons ADD CONSTRAINT FK_59A9B0515278319C FOREIGN KEY (series_id) REFERENCES app_series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_episodes ADD CONSTRAINT FK_75553E704EC001D1 FOREIGN KEY (season_id) REFERENCES app_seasons (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_historic ADD CONSTRAINT FK_A5D28FFBA76ED395 FOREIGN KEY (user_id) REFERENCES app_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_historic ADD CONSTRAINT FK_A5D28FFB5278319C FOREIGN KEY (series_id) REFERENCES app_series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE app_historic ADD CONSTRAINT FK_A5D28FFB362B62A0 FOREIGN KEY (episode_id) REFERENCES app_episodes (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE app_historic DROP CONSTRAINT FK_A5D28FFBA76ED395');
        $this->addSql('ALTER TABLE app_series DROP CONSTRAINT FK_DF136CAD9D47B361');
        $this->addSql('ALTER TABLE app_mtm_series_to_categories DROP CONSTRAINT FK_1B976C15278319C');
        $this->addSql('ALTER TABLE app_seasons DROP CONSTRAINT FK_59A9B0515278319C');
        $this->addSql('ALTER TABLE app_historic DROP CONSTRAINT FK_A5D28FFB5278319C');
        $this->addSql('ALTER TABLE app_mtm_series_to_categories DROP CONSTRAINT FK_1B976C112469DE2');
        $this->addSql('ALTER TABLE app_episodes DROP CONSTRAINT FK_75553E704EC001D1');
        $this->addSql('ALTER TABLE app_historic DROP CONSTRAINT FK_A5D28FFB362B62A0');
        $this->addSql('DROP SEQUENCE user_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE series_type_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE series_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE categories_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE seasons_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE episodes_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE historic_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE refresh_tokens_id_seq CASCADE');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE app_series_type');
        $this->addSql('DROP TABLE app_series');
        $this->addSql('DROP TABLE app_mtm_series_to_categories');
        $this->addSql('DROP TABLE app_categories');
        $this->addSql('DROP TABLE app_seasons');
        $this->addSql('DROP TABLE app_episodes');
        $this->addSql('DROP TABLE app_historic');
        $this->addSql('DROP TABLE refresh_tokens');
    }
}
