<?php declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20181229111448 extends AbstractMigration
{
    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SEQUENCE seasons_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE seasons (id INT NOT NULL, series_id INT DEFAULT NULL, rank INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, created_by VARCHAR(255) DEFAULT NULL, updated_by VARCHAR(255) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_B4F4301C5278319C ON seasons (series_id)');
        $this->addSql('ALTER TABLE seasons ADD CONSTRAINT FK_B4F4301C5278319C FOREIGN KEY (series_id) REFERENCES series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE episodes DROP CONSTRAINT fk_7dd55edd5278319c');
        $this->addSql('DROP INDEX idx_7dd55edd5278319c');
        $this->addSql('ALTER TABLE episodes ADD rank INT NOT NULL');
        $this->addSql('ALTER TABLE episodes RENAME COLUMN series_id TO season_id');
        $this->addSql('ALTER TABLE episodes ADD CONSTRAINT FK_7DD55EDD4EC001D1 FOREIGN KEY (season_id) REFERENCES seasons (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_7DD55EDD4EC001D1 ON episodes (season_id)');
        $this->addSql('ALTER TABLE series ADD locale VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('ALTER TABLE episodes DROP CONSTRAINT FK_7DD55EDD4EC001D1');
        $this->addSql('DROP SEQUENCE seasons_id_seq CASCADE');
        $this->addSql('DROP TABLE seasons');
        $this->addSql('DROP INDEX IDX_7DD55EDD4EC001D1');
        $this->addSql('ALTER TABLE episodes DROP rank');
        $this->addSql('ALTER TABLE episodes RENAME COLUMN season_id TO series_id');
        $this->addSql('ALTER TABLE episodes ADD CONSTRAINT fk_7dd55edd5278319c FOREIGN KEY (series_id) REFERENCES series (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_7dd55edd5278319c ON episodes (series_id)');
        $this->addSql('ALTER TABLE series DROP locale');
    }
}
